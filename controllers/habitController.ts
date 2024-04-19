import execute from '../mysql';    //const execute = require('../mysql');
import {Request, Response } from 'express';
import { readForUser } from '../model/User';

type Express = (req: Request, res: Response) => void;
type Result = {
    id_habit: number,
    id_user: number,
    name: string,
    description: string,
    goal: string,
    status: string,
    created_at: string,
    updated_at: string
}

export const create: Express = async (req, res) => {
        try {  
            const query: string = `INSERT INTO habits (id_user, name, description, goal) VALUES (?,?,?,?)`;                                           
            const params: string[] = [req.body.user.id_user, req.body.name, req.body.description, req.body.goal];                
            const result: any = await execute(query, params);
              
                const response = {
                    message: 'Hábito cadastrado com sucesso!!',
                    id_user: result.insertId,
                    name: req.body.name,
                    description: req.body.description,
                    status: 'não concluido',
                }
        
                return res.status(200).send({response});
            } catch (error) {
                return res.status(500).send({error: error});
            }            
}

export const read: Express = async (req, res) => {
    try {
        const query: string = 'SELECT * FROM habits WHERE id_user=?';
        const result: any = await execute(query, [req.params.id_user]);

        const users = await readForUser(req, res);
        const response = {
            message: 'Listagem de todos habitos do utilizador',
            count: result.length,
            users: users
        }

        return res.status(200).send({response});
    } catch (error) {
        return res.status(500).send({error});
    }
}

export const readAll: Express = async (req, res) => {
    try {
        const query: string = 'SELECT * FROM habits';
        const result: any = await execute(query);
        const response = {
            message: 'Listagem de todos habitos cadastrados',
            count: result.length,
            habits: result.map((habit: any) => {
                return {
                    id_habit: habit.id_habit,
                    id_user: habit.id_user,
                    habit_name: habit.name,
                    habit_description: habit.description,
                    habit_status: habit.stauts,
                    goal: habit.goal,
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
        const query: string = 'SELECT * FROM habits WHERE id_habit=?';
        const result: any = await execute(query, [req.params.id_habit]);
        if(result.length < 1) return res.status(500).send({error: 'habito não encontrado'});
        const response = {
            habit:{
                id_habit: result[0].id_habit,
                id_user: result[0].id_user,
                habit_name: result[0].name,
                habit_description: result[0].description,
                status: result[0].status,
                goal: result[0].goal,
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

            const query: string = `UPDATE habits SET name=?, description=?, goal=? WHERE id_habit=?`;
            const params: string[] = [req.body.name, req.body.description, req.body.goal, req.params.id_habit];               
            const result: any = await execute(query, params);
            if(result.length < 1) return res.status(500).send({error: 'Habito não econtrado'});
            const response = {
                message: 'Habito actualizado com sucesso',
                id_user: req.body.id_user,
                id_habit: req.body.id_habit,
                habit_name: req.body.name,
                habit_description: req.body.description,
                habit_status: req.body.stauts,
                goal: req.body.goal
            }
            
            return res.status(200).send({response});
        } catch(error){
            return res.status(500).send({error: error});
        }
}

export const deletee: Express = async (req, res) => {
    try {

        const query1: string = 'SELECT * FROM habits WHERE id_habit=?';
        const search: any = await execute(query1, [req.params.id_habit]);
        if(search.length === 0) return res.status(500).send({error: 'Habito não encontrado!!'});

            const query = 'DELETE FROM habits WHERE id_habit=?';
            await execute(query, [req.params.id_habit]);
        return res.status(200).send({});    
    } catch (error) {
        return res.status(500).send({error: error});
    }
}


let set_reset: boolean = true;
export const toggleStatus: Express = (req, res) => {
            const up = async (state: string) => {
                    try{

                        const query1: string = 'SELECT * FROM habits WHERE id_habit = ?';
                        const result: any = await execute(query1, [req.params.id_habit]);
                        if(result.length < 1) return res.status(404).send({message: 'habito não encontrado'});

                        const query: string = 'UPDATE habits SET status = ? WHERE id_habit=?';
                        await execute(query, [state, req.params.id_habit]);
                        const response = {
                            messagem: 'alterado!!',
                            id_habit: req.params.id_habit,
                            status: state
                        }

                        return res.status(200).send({response});
                    }catch(error){
                        return res.status(500).send({error});
                    }
            };

            if(set_reset){
                up('concluido');
            } else {
                up('não concluido');
            }
            set_reset  = !set_reset;
        }


//LISTAGEM DE TODAS CATEGORIAS RELACIONADAS A UM HABITO
export const readCategoriesPerHabit: Express = async (req, res) => {
    try {

        const query0: string = 'SELECT name FROM habits WHERE id_habit=?';
        const habit_name: any = await execute(query0, [req.params.id_habit]);

        const query: string = 'SELECT * FROM habits_categories WHERE id_habit=? and id_user=?';
        const result:any = await execute(query, [req.params.id_habit, req.body.user.id_user]);
0
        let results: any = [];
        for(let i of result){
            const querys = 'SELECT * FROM categories WHERE id_category=?';
            const one: any = await execute(querys, i.id_category);
            results.push(one[0]);
        }

        const response = {
            message: 'Listagem de todas categorias relacionadas à um hábito',
            count: results.length,
            id_user: req.body.user.id_user,
            id_habit: req.params.id_habit,
            habit_name: habit_name[0].name,
            categories: results.map((category: any) => {
                return {
                    id_category: category.id_category,
                    category_name: category.name,
                }
            })
        }

        return res.status(200).send({response});
    } catch (error) {
        return res.status(500).send({error});
    }
}        