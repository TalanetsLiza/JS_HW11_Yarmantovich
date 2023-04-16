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
        this.readDateFromStorage();
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
        
        this.saveDateToStorage();

        return newUser;
    };

    remove(userId) {
        super.remove(userId);

        document.querySelector(`.contact[data-id="${userId}"]`).remove();

        console.log(this.data);
        this.saveDateToStorage();
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
        this.saveDateToStorage();        
    };

    saveDateToStorage() {
        const allUserData = super.get();
        if(!allUserData.length) {
            localStorage.removeItem("contacts");
            return;
        }
        localStorage.setItem("contacts", JSON.stringify(allUserData));

        this.updateStorageExpiration();
    };

    readDateFromStorage() {
        const dataNotExpired = document.cookie.includes("storageExpiration=true");

        if (!dataNotExpired) {
            localStorage.removeItem("contacts");
            return;            
        }

        const stringifyData = localStorage.getItem("contacts");

        if(!stringifyData) {
            return
        }

        const data = JSON.parse(stringifyData);
        data.forEach((userData) => {
            this.add(userData);
        });
    };

    updateStorageExpiration() {
        // const maxAge = 10;
        const maxAge = 60 * 60 * 24 * 10; // 10 days
        document.cookie = `storageExpiration=true; path=/; max-age=${maxAge}`;

        // const expires = new Date();
        // expires.setDate(expires.getDate() + 10);
        // document.cookie = `${name}=${value}; path=/; expires=${expires}`;
    };
}

const constactsApp = new ContactsApp();
