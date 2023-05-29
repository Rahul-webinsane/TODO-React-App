import { useEffect, useState }from 'react'
import '../todo/todolist.css'
import deleteIcon from '../../assets/delete.png'
import editIcon from '../../assets/edit.png'
import axios from 'axios';




export const TodoList = () => {


    // const todoListUrl="http://localhost:3005/api/todolist";
    // const addTodoListUrl="http://localhost:3005/api/todolist/add";
    // const deleteTodoItemUrl="http://localhost:3005/api/todolist/delete";
    // const updateTodoItemUrl="http://localhost:3005/api/todolist/update";

    const todoListUrl="https://todo-expressjs.vercel.app/api/todolist";
    const addTodoListUrl="https://todo-expressjs.vercel.app/api/todolist/add";
    const deleteTodoItemUrl="https://todo-expressjs.vercel.app/api/todolist/delete";
    const updateTodoItemUrl="https://todo-expressjs.vercel.app/api/todolist/update";


    


    const [newTodoValue, setNewTodoValue] = useState("")
    const [errorMsg, setErrorMsg] = useState(false)
    const [data, setData] = useState([])
    const [editList, setEditList] = useState([])
    const [editInputValue, setEditInputValue] = useState({})
    const [editErrorMsg, setEditErrorMsg] = useState([])



    // new Code

    const [getTodoList, setTodoList] = useState([])
    const [editItemList, setEditItemList] = useState([])

    useEffect(() => {
        let localStorageData = localStorage.getItem("TODO_LIST");
        localStorageData && setData(JSON.parse(localStorageData))
    }, [])


    useEffect(() => {
        fetchTodoList();
        console.log("Edit List----",editList);
    }, [])

    
  const fetchTodoList = async ()=>{
    const response = await axios(todoListUrl);
    let res = response.data.result;
    console.log("AXIosssss Todo List -------",res);
    setTodoList(res);
  }
    



    const addTodoHandleChange = (event) => {
        setNewTodoValue(event.target.value)
        errorMsg && !event.target.value == '' ? setErrorMsg(false) : null
    }

    // const addTodo = (event) => {
    //     event.preventDefault()
    //     if (newTodoValue == '') {
    //         setErrorMsg(true)
    //     } else {
    //         let id = data.length + 1
    //         while (data.find((item) => item.id === id)) {
    //             id++
    //         }
    //         const newData = [...data, {
    //             id,
    //             text: newTodoValue,
    //             completed: false
    //         }]
    //         setData(newData)
    //         localStorage.setItem('TODO_LIST', JSON.stringify(newData));
    //         setNewTodoValue("")
    //     }
    // }

     const addTodo = (event) => {
        event.preventDefault()
        if (newTodoValue == '') {
            setErrorMsg(true)
        } else {
            let id = getTodoList.length + 1
            while (data.find((item) => item.id === id)) {
                id++
            }
            const todoData = {
                id,
                text: newTodoValue,
                completed: false
            }

            axios.post(addTodoListUrl, todoData)
            .then(response => {
                console.log("Ressssssssss",response);
                setTodoList(response.data.result)
            }).catch(error => {
                console.error('There was an error!', error);
            });
            setNewTodoValue("")
        }
    }

    
    const deleteTodo = (id) => {
        console.log("Delete Id----",id);
        const payload = {data:{params:id}}
        axios.delete(deleteTodoItemUrl,payload)
            .then(response => {
                console.log("delete Response",response);
                setTodoList(response.data.result)
            }).catch(error => {
                console.error('There was an error!', error);
            });
    }


    // const deleteTodo = (id) => {
    //     const newData = data.filter(todo => todo.id != id);
    //     setData(newData)
    //     localStorage.setItem('TODO_LIST', JSON.stringify(newData));
    // }

    const editTodo = (id) => {
        setEditList([...editList, id])
    }

    const cancelEdit = (id) => {
        editErrorMsg.includes(id) && setEditErrorMsg(editErrorMsg.filter((ids) => ids != id))
        setEditList(editList.filter((ids) => ids != id))
    }

    const handleEditInput = (event) => {
        event.target.value != '' && setEditErrorMsg(editErrorMsg.filter((ids) => ids != Number(event.target.name)))
        setEditInputValue({ ...editInputValue, [Number(event.target.name)]: event.target.value })
    }

    const saveEditedData = (id, event, oldValue, status) => {

        console.log("Saved Data ----",id,event,oldValue,status);
        event.preventDefault()
        id = Number(id)
        if (editInputValue[id] == '') {
            setEditErrorMsg([...editErrorMsg, id])
        } else {
            let text;
            editInputValue[id] === undefined ? text = oldValue : text = editInputValue[id]
            const newData = [...data.filter((item) => item.id != id), {
                id,
                text,
                completed: status
            }]
            setData(newData)
            // localStorage.setItem('TODO_LIST', JSON.stringify(newData));
            const updateParam ={id,text,completed: status};
            const payload = updateParam;
            axios.put(updateTodoItemUrl,payload).then(response => {
                console.log("PUT Response",response);
                setTodoList(response.data.result)
            }).catch(error => {
                console.error('There was an error!', error);
            });

            cancelEdit(id)
        }
    }

    const completeTodo = (id, text, status) => {
        const newData = [...data.filter((item) => item.id != id), {
            id,
            text,
            completed: !status
        }]
        // setData(newData)
        setTodoList(newData)
        // localStorage.setItem('TODO_LIST', JSON.stringify(newData));

    }

  

    return (
        <div className='todo'>
            <h1>Todo List</h1>
            <form className='todo-add-form'>
                <input type="text" value={newTodoValue} name="todo" placeholder='New Todo' onChange={addTodoHandleChange} />
                <button onClick={addTodo}>ADD TODO</button>
            </form>
            {errorMsg && <p className='error-msg'>Please Add item </p>}
            <div className="todo-list">
                {getTodoList.slice().sort((a, b) => b.id - a.id).map((item) => {
                    return (
                        editList.includes(item.id) ? 
                        
                        <div className="todo-list-item-edit" key={item.id}>
                            <form className='todo-edit-form'>
                                <input type="text" name={item.id} defaultValue={item.text} placeholder='Edit..' onChange={handleEditInput} />
                                <button className='save-btn' onClick={(event) => saveEditedData(item.id, event, item.text, item.completed)}>SAVE</button>
                                <button className='cancel-btn' onClick={() => cancelEdit(item.id)}>CANCEL</button>
                            </form>
                            {editErrorMsg.includes(item.id) && <p className='error-msg-edit'>Please Update item</p>}
                        </div>
                            : 
                        <div className="todo-list-item" key={item.id}>
                            <p onClick={() => completeTodo(item.id, item.text, item.completed)}>{item.completed ? <strike>{item.text}</strike> : item.text}</p>
                            <div className="action-icons">
                                <img src={editIcon} onClick={() => editTodo(item.id)} className='edit-icon' />
                                <img src={deleteIcon} onClick={() => deleteTodo(item.id)} className='delete-icon' />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
