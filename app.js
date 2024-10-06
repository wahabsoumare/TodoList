import { fetchJSON } from "./api.js"
import { TodoList } from "./components.js"
import { createElement } from "./functions.js"

try {
    const url = "https://jsonplaceholder.typicode.com/todos?_limit=2"
    const todos = await fetchJSON(url)
    // console.log(todos)
    const list = new TodoList(todos)
    list.appendTo(document.querySelector('#todolist'))
} catch (e) {
    const alertElement = createElement('div', {
        class : 'alert alert-danger m-2',
        role : 'alert'
    })
    alertElement.innerText = 'Impossible de charger les elements'
    document.body.prepend(alertElement)
    console.error(e)
}

