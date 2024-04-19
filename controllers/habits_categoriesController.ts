import express, {Request, Response} from 'express';
import execute from '../mysql';

type Express = (req: Request, res: Response) => void;

export const create_habit: Express = async (req, res) => {

    try{
        const query: string = `INSERT INTO habits_categories (id_habit, id_category, id_user)
                               VALUES (?,?,?)`;
        for(let id of req.body.list){
            await execute(query, [req.body.id_habit, id, req.body.user.id_user]);
        }

        return res.status(200).send({message: 'cadastrado com sucesso!!'});
    }catch(error){
        return res.status(500).send({error: error});
    }
}

export const create_category: Express = async (req, res) => {

    try{
        const query: string = `INSERT INTO habits_categories (id_habit, id_category, id_user)
                               VALUES (?,?,?)`;
        for(let id of req.body.list){
            await execute(query, [id, req.body.id_category, req.body.user.id_user]);
        }

        return res.status(200).send({message: 'cadastrado com sucesso!!'});
    }catch(error){
        return res.status(500).send({error: error});
    }
}

