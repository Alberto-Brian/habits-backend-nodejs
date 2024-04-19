import execute from '../mysql';    //const execute = require('../mysql');
import {Request, Response } from 'express';
import validate from '../utils/auth';
import hash from '../utils/hash';


type Express = (req: Request, res: Response) => void;
type User = {
    id_user: number,
    user_name: string,
    email: string,
    profile: string,
    path_avatar: string
}


export const read_users = () => {

    return new Promise( async(resolve, reject) => {
        try {
            const query: string = 'SELECT * FROM users';
            const result: any = await execute(query);
            // console.log(req.user);
            const response: any = {
                users: result.map((user: any) => {
                    return {
                        id_user: user.id_user,
                        user_name: user.user_name,
                        email: user.email,
                        profile: user.profile,
                        path_avatar: user.avatar,
                    }
                })
            }
            resolve(result);
    }catch (error) {
        reject(error)
    }

});
}

export const create_user: Express = (req, res) => {

    return new Promise(async(resolve, reject) => {
        try {
        
            const query1: string = 'SELECT * FROM users WHERE email=?';
            const result1: any = await execute(query1, [req.body.email]);
            if(result1.length > 0)  reject('Utilizador já cadastrado');  //throw new Error('Utilizador já cadastrado');  
    
            const query: string = `INSERT INTO users (user_name, email, password, profile) VALUES (?,?,?,?)`;                                           
            const params: string[] = [req.body.user_name, req.body.email, await hash(req.body.password), req.body.profile];                
            const result: any = await execute(query, params);
            const token: string | unknown = await validate(req.body.email, req.body.password); 
            
                const response = {
                    user: {
                        id_user: result.insertId,
                        name: req.body.user_name,
                        email: req.body.email,
                        profile: req.body.profile,
                    },
                    token: token
                }
        
                resolve(response);
            } catch (error) {
                reject(error);
            } 
    })

              
}

export const readForUser: Express = async (req, res) => {
    return new Promise(async(resolve, reject) => {
        try {
            const query: string = 'SELECT * FROM habits WHERE id_user=?';
            const result: any = await execute(query, [req.params.id_user]);
            if(result.length < 1) reject('utilizador não encontrado');

            const response = {
                message: 'Listagem de todos habitos do utilizador',
                count: result.length,
                users: result.map((habit: any) => {
                    return {
                        id_user: habit.id_user,
                        id_habit: habit.id_habit,
                        habit_name: habit.name,
                        habit_description: habit.description,
                        habit_status: habit.stauts,
                        goal: habit.goal,
                        created_at: habit.created_at,
                        updated_at: habit.updated_at
                    }
                })
            }

            resolve(response.users);
        } catch (error) {
            reject(error);
        }
    })
}
