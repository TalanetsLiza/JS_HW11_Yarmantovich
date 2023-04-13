"use strict";

class User {
    constructor(user) {
        this.data = {
            ...user,
            id: `${Date.now()}.${Math.random()}`,
        };
    }

    edit(newUserData) {
        this.data = {
            ...this.data,
            ...newUserData,
        };
    }

    get() {
        return this.data;
    }
};

class Contacts {
    constructor() {
        this.data = [];
    }

    add(userData) {
		const newUser = new User(userData);
		this.data.push(newUser);
        return newUser;
	}

    getUserById(id) {
        return this.data.find((user) => user.get().id === id);
    }

    edit(id, newUserData) {
        const user = this.getUserById(id);
        if (!user) {
            return;
        }

        user.edit(newUserData);
        return user;
    }

    remove(id) {
        this.data = this.data.filter((user) => user.get().id !== id)
    }

    get() {
        return this.data.map((user) => user.get());
    }
};

class ContactsApp extends Contacts {
    constructor() {
        super();
        this.addEventListeners();
    };

    addEventListeners() {
        document.querySelector(".form").addEventListener("submit", this.onAdd);
    };

    onAdd = (event) => {
        event.preventDefault();

        const userData = {};
        const form = event.currentTarget;
        const inputs = [...form.elements].filter((element) => element.tagName === "INPUT");
        inputs.forEach((input) => {
            userData[input.name] = input.value;
        });

        if (!userData.name || !userData.phone) {
            alert("Invalid data");
            return;
        }

        inputs.forEach((input) => {
            input.value = ""
        });

        this.add(userData);
    };

    onEdit = (event) => {
        event.preventDefault();

        const userId = event.currentTarget.dataset.id;
        const oldUserData = super.getUserById(userId).get();

        const newUserData = {};

        newUserData.name = prompt("Edit Name", oldUserData.name);
        newUserData.email = prompt("Edit Email", oldUserData.email);
        newUserData.address = prompt("Edit Address", oldUserData.address);
        newUserData.phone = prompt("Edit Phone", oldUserData.phone);

        this.edit(userId, newUserData)
    };

    onRemove = (event) => {
        event.preventDefault();
        // const userId = event.currentTarget.getAttribute("data-id");
        const userId = event.currentTarget.dataset.id;

        this.remove(userId);
    };

    add(newUserData) {
        const newUser = super.add(newUserData);

        const userData = newUser.get();
        const templateItem = document.getElementById("template-item").content.cloneNode(true);
        const contactList = document.querySelector(".contacts__list");
        contactList.appendChild(templateItem);
        const contactElement = contactList.children[contactList.children.length - 1];

        contactElement.dataset.id = userData.id;
        contactElement.querySelector(".contact__name").innerText = userData.name;
        contactElement.querySelector(".contact__phone").innerText = userData.phone;
        contactElement.querySelector(".contact__email").innerText = userData.email;
        contactElement.querySelector(".contact__address").innerText = userData.address;

        const removeButton = contactElement.querySelector(".js-remove-button");
        const editButton = contactElement.querySelector(".js-edit-button");

        // removeButton.setAttribute("data-id", userData.id);
        removeButton.dataset.id = userData.id;
        removeButton.addEventListener("click", this.onRemove);

        editButton.dataset.id = userData.id;
        editButton.addEventListener("click", this.onEdit);
    
        console.log(this.data);

        return newUser;
    };

    remove(userId) {
        super.remove(userId);

        document.querySelector(`.contact[data-id="${userId}"]`).remove();

        console.log(this.data);
    };

    edit(userId, userData) {
        const newUser = super.edit(userId, userData);
        const newUserData = newUser.get();

        const contactContainer = document.querySelector(`.contact[data-id="${userId}"]`);
        contactContainer.querySelector(".contact__name").innerText = newUserData.name;
        contactContainer.querySelector(".contact__phone").innerText = newUserData.phone;
        contactContainer.querySelector(".contact__email").innerText = newUserData.email;
        contactContainer.querySelector(".contact__address").innerText = newUserData.address;

        console.log(this.data);        
    }
}

const constactsApp = new ContactsApp();

constactsApp.add({
    name: "Ivan",
    email: "ivan@gmail.com",
    address: "Minsk, st. Lenin",
    phone: "375298888888"
});
const lizaUser = constactsApp.add({
    name: "Liza",
    email: "liza@gmail.com",
    address: "Minsk, st. Lenina ",
    phone: "375295555555"
});

setTimeout(() => {
    constactsApp.edit(lizaUser.get().id, {
        phone: "375296666666"
    });
}, 3000);

setTimeout(() => {
    constactsApp.remove(lizaUser.get().id);
}, 5000);