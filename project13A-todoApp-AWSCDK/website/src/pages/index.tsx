import React, { useEffect, useState } from "react";
import { API } from 'aws-amplify';
import { allTodos } from "../graphql/queries";
import shortid from 'shortid';
import { createTodo } from "../graphql/mutations";


export default function Home() {
  const [title, setTitle] = useState('');
  const [checked, setChecked] = useState(false);


  const onSubmit = async () => {
    const todo = {
      id: shortid.generate(),
      title,
      checked
    }
    await createTodo
  }

  const fetchData = async () => {
    try {
      const data = await API.graphql({
        query: allTodos
      })
      console.log('data', data);
    } catch (err) {
      console.log("err", err);
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="container">
      <div>
        <form>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
      <div></div>
    </div>)
}
