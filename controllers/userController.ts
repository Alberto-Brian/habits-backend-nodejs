import execute from '../mysql';    //const execute = require('../mysql');
import bcrypt from 'bcrypt'; 
import {Request, Response } from 'express';
import validate from '../utils/auth';
import limitlist from '../utils/limitlist';
import { read_users, create_user } from '../model/User';
import hash from '../utils/hash';

type Express = (req: Request, res: Response) => void;

export const login: Express = async (req, res) => {
    try{
        const query = 'SELECT * FROM users WHERE email=?';
        const user: any = await execute(query, [req.body.email]);
        if(user.length < 1) throw new Error('Utilizador não encontrado')
        const token: string | unknown = await validate(req.body.email, req.body.password);
        return res.status(200).send({
            token: token, 
            user: {
                id_user: user[0].id_user,
                user_name: user[0].user_name,
                email: user[0].email,
                profile: user[0].profile,
                status: user[0].status,
                path_avatar: user[0].avatar
            }
        })
    }catch(error){
        return res.status(401).send({error: error});
    }
}

export const create: Express = async (req, res) => {
        try {
                const response = await create_user(req, res);
                return res.status(200).send({response: response});
            } catch (error) {
                return res.status(500).send({error: error});
            }            
}

export const read: Express = async (req, res) => {
    try {
        const result: any = await read_users();
        const response = {
            message: 'Listagem de todos usuários',
            count: result.length,
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

        console.log(limitlist(response.users));

        return res.status(200).send({response});
    } catch (error) {
        return res.status(500).send({error});
    }
}

export const findOne: Express = async (req, res) => {
    try{
        const query: string = 'SELECT * FROM users WHERE id_user=?';
        const result: any = await execute(query, [req.params.id_user]);
        if(result.length < 1) return res.status(500).send({error: 'Utilizador não encontrado'});
        const response = {
            user: {
                id_user: result[0].id_user,
                user_name: result[0].user_name,
                email: result[0].email,
                status: result[0].status,
                profile: result[0].profile,
            }
        }
        
        return res.status(200).send({response});
    } catch(error){
        return res.status(500).send({error});
    }
}

export  const update: Express = async (req, res) => {

    bcrypt.hash(req.body.password, 10, async (error, hash) => {
        if(error) return res.status(500).send({error});
        try{

            const query: string = `UPDATE users SET user_name=?, password=?, 
                                   profile=?, avatar=? WHERE id_user =?`;
            const params: string[] = [req.body.user_name, hash,  req.body.profile,
                            req.file?.path, req.params.id_user];               
            const result: any = await execute(query, params);
            if(result.length < 1) return res.status(500).send({error: 'Utilizador não encontrado'});
            const response = {
                message: 'Utilizador actualizado com sucesso',
                id_user: req.params.id_user,
                user_name: req.body.user_name,
                email: req.body.email,
                profile: req.body.profile,
                avatar_path: req.file?.path,
            }
            
            return res.status(200).send({response});
        } catch(error){
            return res.status(500).send({error: error});
        }
    })
}


export const uploadi: Express = async (req, res) => {
        try{
            const query: string = `UPDATE users SET avatar=? WHERE id_user =?`;
            const params: string[] = [req.file?.path ?? '', req.params.id_user];               
            const result: any = await execute(query, params);
            if(result.length < 1) return res.status(500).send({error: 'Utilizador não encontrado'});
            const response = {
                message: 'imagem actualizada com sucesso',
                id_user: req.params.id_user,
                avatar_path: req.file?.path,
            }
            
            return res.status(200).send({response});
        } catch(error){
            return res.status(500).send({error: error});
        }
}

export const deletee: Express = async (req, res) => {
    try {

        const query1: string = 'SELECT * FROM users WHERE id_user=?';
        const search: any = await execute(query1, [req.params.id_user]);
        if(search.length === 0) return res.status(500).send({error: 'Utilizador inexistente'});

            const query = 'DELETE FROM users WHERE id_user=?';
            await execute(query, [req.params.id_user]);
        return res.status(200).send({});    
    } catch (error) {
        return res.status(500).send({error: error});
    }
}

let set_reset: boolean = true;
export const toggleStatus: Express = (req, res) => {
            const up = async (state: number) => {
                    try{

                        const query1: string = 'SELECT * FROM users WHERE id_user = ?';
                        const result: any = await execute(query1, [req.body.user.id_user]);
                        if(result.length < 1) return res.status(404).send({message: 'utilizador não encontrado'});

                        const query: string = 'UPDATE users SET status = ? WHERE id_user=?';
                        await execute(query, [state, req.body.user.id_user]);
                        const response = {
                            messagem: 'alterado!!',
                            id_user: req.body.user.id_user,
                            status: state
                        }

                        return res.status(200).send({response});
                    }catch(error){
                        return res.status(500).send({error});
                    }
            };

            if(set_reset){
                up(1);
            } else {
                up(0);
            }
            set_reset  = !set_reset;
        }

