import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

interface ITodo {
  id: number;
  title: string;
  completed: boolean;
}

let todos: ITodo[] = [
  { id: 1, title: 'My Todo 1', completed: false },
  { id: 2, title: 'My Todo 2', completed: false },
  { id: 3, title: 'My Todo 3', completed: false },
];

app.use(express.json());

app.get("/", (_: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get('/todos', (_: Request, res: Response) => {
  res.json(todos);
});

app.get('/todos/:id', (req: Request, res: Response) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ message: 'Todo not found' });

  res.json(todo);
});

app.post('/todos', (req: Request, res: Response) => {
  const {title, completed} = req.body
  const todo: ITodo = {
    id: todos.length + 1,
    title, 
    completed
  };

  todos.push(todo);
  res.status(201).json(todo);
});

app.put('/todos/:id', (req: Request, res: Response) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ message: 'Todo not found' });

  const {id: rejectId, ...body} = req.body
  if(rejectId) return res.status(400).json({ message: "Cannot update 'id' attribute!!" });

  const {id, ...attrs} = todo
  const updatedTodo: ITodo = {
    id,
    ...attrs,
    ...body
  };

  const index = todos.indexOf(todo);
  todos[index] = updatedTodo

  res.json(updatedTodo);
});

app.delete('/todos/:id', (req: Request, res: Response) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));

  if (!todo) return res.status(404).json({ message: 'Todo not found' });

  const index = todos.indexOf(todo);
  todos.splice(index, 1);

  res.json({ message: 'Todo deleted successfully' });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
  