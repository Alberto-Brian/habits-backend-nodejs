import execute from '../mysql';    //const execute = require('../mysql');
import {Request, Response } from 'express';

type Express = (req: Request, res: Response) => void;

export const create: Express = async (req, res) => {
        try {

            const query: string = `INSERT INTO categories (name, description) VALUES (?,?)`;                                           
            const params: string[] = [req.body.name, req.body.description];                
            const result: any = await execute(query, params);
       
                const response = {
                    message: 'Categoria cadastrada com sucesso!!',
                    id_category: result.insertId,
                    name: req.body.name,
                    description: req.body.description,
                }
        
                return res.status(200).send({response});
            } catch (error) {
                return res.status(500).send({error: error});
            }            
}

export const read: Express = async (req, res) => {
    try {

        const query0: string = 'SELECT name FROM categories WHERE id_category=?';
        const category_name: any = await execute(query0, [req.params.id_category]);

        const query: string = 'SELECT * FROM habits_categories WHERE id_category=? and id_user=?';
        const result:any = await execute(query, [req.params.id_category, req.body.user.id_user]);

        let results: any = [];
        for(let i of result){
            const querys = 'SELECT * FROM habits WHERE id_habit=?';
            const one: any = await execute(querys, i.id_habit);
            results.push(one[0]);
        }

        const response = {
            message: 'Listagem de todos habitos de uma categoria',
            count: results.length,
            id_user: req.body.user.id_user,
            id_category: req.params.id_category,
            category_name: category_name[0].name,
            habits: results.map((habit: any) => {
                return {
                    id_habit: habit.id_habit,
                    habit_name: habit.name,
                }
            })
        }

        return res.status(200).send({response});
    } catch (error) {
        return res.status(500).send({error});
    }
}

export const readAll: Express = async (req, res) => {
    try {
        const query: string = 'SELECT * FROM categories';
        const result: any = await execute(query);
        const response = {
            message: 'Listagem de todas categorias',
            count: result.length,
            users: result.map((habit: any) => {
                return {
                    id_category: habit.id_category,
                    habit_name: habit.name,
                    habit_description: habit.description,
                    created_at: habit.created_at,
                    updated_at: habit.updated_at
                }
            })
        }

        return res.status(200).send({response});
    } catch (error) {
        return res.status(500).send({error});
    }
}

export const findOne: Express = async (req, res) => {
    try{
        const query: string = 'SELECT * FROM categories WHERE id_category=?';
        const result: any = await execute(query, [req.params.id_category]);
        if(result.length < 1) return res.status(500).send({error: 'categoria não encontrada'});
        const response = {
            category: {
                id_category: result[0].id_category,
                category_name: result[0].name,
                category_description: result[0].description,
                created_at: result[0].created_at,
                updated_at: result[0].updated_at
            }
        }
        
        return res.status(200).send({response});
    } catch(error){
        return res.status(500).send({error});
    }
}

export  const update: Express = async (req, res) => {
        try{

            const query: string = `UPDATE categories SET name=?, description=? WHERE id_category=?`;
            const params: string[] = [req.body.name, req.body.description, req.params.id_category];               
            const result: any = await execute(query, params);
            if(result.length < 1) return res.status(500).send({error: 'Categoria não econtrada'});
            
            const query0: string = 'SELECT * FROM categories WHERE id_category=?'; 
            const result0: any =  await execute(query0, [req.params.id_category]);

            const response = {
                message: 'Categoria actualizada com sucesso',
                id_category: req.body.id_category,
                category_name: req.body.name,
                category_description: req.body.description,
                created_at: result0[0].created_at,
                updated_at: result0[0].updated_at
            }
            
            return res.status(200).send({response});
        } catch(error){
            return res.status(500).send({error: error});
        }
}

export const deletee: Express = async (req, res) => {
    try {

        const query1: string = 'SELECT * FROM categories WHERE id_category=?';
        const search: any = await execute(query1, [req.params.id_category]);
        if(search.length === 0) return res.status(500).send({error: 'Categoria não encontrada!!'});

            const query = 'DELETE FROM categories WHERE id_category=?';
            await execute(query, [req.params.id_category]);
        return res.status(200).send({});    
    } catch (error) {
        return res.status(500).send({error: error});
    }
}


