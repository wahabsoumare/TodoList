import { createElement } from "./functions.js"

/**
 * @typedef {object} Todo
 * @property {number} id
 * @property {string} title
 * @property {boolean} completed
 */

export class TodoList {
    /**
     * @type {Todo[]}
     */
    #todos = []

    /**
     * @type {HTMLUListElement}
     */
    #listElement = []

    /**
     * @param {Todo[]} todos 
     */
    constructor(todos) {
        this.#todos = todos
    }

    /**
     * 
     * @param {HTMLElement} element 
     */
    appendTo(element) {
        element.innerHTML = `
            <form class="d-flex pb-4">
                <input required="" class="form-control" type="text" placeholder="Acheter des patates..." name="title">
                <button class="btn btn-primary">Ajouter</button>
            </form>
            <main>
                <div class="btn-group mb-4" role="group">
                    <button type="button" class="btn btn-outline-primary active" data-filter="all">Toutes</button>
                    <button type="button" class="btn btn-outline-primary" data-filter="todo">A faire</button>
                    <button type="button" class="btn btn-outline-primary" data-filter="done">Faites</button>
                </div>
                <ul class="list-group"></ul>
            </main>
        `
        this.#listElement = element.querySelector('.list-group')
        for (let todo of this.#todos) {
            const item = new TodoListItem(todo, this)
            this.#listElement.append(item.element)
        }
        element.querySelector('form').addEventListener('submit', (e) => this.#onSubmit(e))
        element.querySelectorAll('.btn-group button').forEach(btn => {
            btn.addEventListener('click', (e) => this.#onFilter(e))
        })
    }

    /**
     * 
     * @param {SubmitEvent} e 
     */
    #onSubmit(e) {
        e.preventDefault()
        const form = e.currentTarget
        const title = new FormData(form).get('title').toString().trim()
        if (title === '') {
            return
        }
        const todo = {
            id: Date.now(),
            title,
            completed: false
        }
        const item = new TodoListItem(todo, this)
        this.#listElement.prepend(item.element)
        this.#todos.push(todo)
        this.#onUpdate()
        form.reset()
    }

    #onUpdate() {
        localStorage.setItem('todos', JSON.stringify(this.#todos))
    }

    /**
     * 
     * @param {PointerEvent} e 
     */
    #onFilter(e) {
        e.preventDefault()
        const filter = e.currentTarget.getAttribute('data-filter')
        e.currentTarget.parentElement.querySelector('.active').classList.remove('active')
        e.currentTarget.classList.add('active')
        if (filter === 'todo') {
            this.#listElement.classList.add('hide-completed')
            this.#listElement.classList.remove('hide-todo')
        } else if (filter === 'done') {
            this.#listElement.classList.add('hide-todo')
            this.#listElement.classList.remove('hide-completed')
        } else {
            this.#listElement.classList.remove('hide-todo')
            this.#listElement.classList.remove('hide-completed')
        }
    }

    removeTodo(id) {
        this.#todos = this.#todos.filter(todo => todo.id !== id);
        this.#onUpdate();
    }
}

class TodoListItem {
    #element

    /**
     * @type {Todo}
     */
    constructor(todo, todoList) {
        const li = createElement('li', {
            class: 'todo list-group-item d-flex align-items-center'
        })

        this.#element = li

        const checkbox = createElement('input', {
            type: 'checkbox',
            class: 'form-check-input',
            id: `todo-${todo.id}`,
            checked: todo.completed
        })

        const label = createElement('label', {
            class: 'ms-2 form-check-label',
            for: `todo-${todo.id}`,
        })
        label.innerText = todo.title

        const removeButton = createElement('button', {
            class: 'ms-auto btn btn-danger btn-sm',
            type: 'button'
        })
        removeButton.innerHTML = '<i class="bi-trash"></i>'

        li.append(checkbox)
        li.append(label)
        li.append(removeButton)
        this.toggle(checkbox)

        removeButton.addEventListener('click', () => {
            todoList.removeTodo(todo.id);
            this.removeItem();
        })
        checkbox.addEventListener('change', e => this.toggle(e.currentTarget))
    }

    /**
     * @return {HTMLElement}
     */
    get element() {
        return this.#element
    }

    removeItem() {
        this.#element.remove();
    }

    /**
     * 
     * @param {HTMLInputElement} checkbox 
     */
    toggle(checkbox) {
        if (checkbox.checked) {
            this.#element.classList.add('is-completed')
        } else {
            this.#element.classList.remove('is-completed')
        }
    }
}
