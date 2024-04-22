import { Request, Response} from 'express';
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken'; 
import execute from '../mysql'; 


export default (email: string, password: string) => {

    return new Promise(async(resolve, reject) => {

        const query: string =  'SELECT * FROM users WHERE email=?';
        const results: any = await execute(query, [email]);
        if(results.length < 1) {
            reject('email não encontrado!!');
            return
        } 
    
        bcrypt.compare(password, results[0].password, (error, result) => {
            if(error) reject(error); 
            const token = jwt.sign({
                id_user: results[0].id_user,
                user_name: results[0].user_name,
                email: email,
                profile: results[0].profile,
                path_avatar: results[0].avatar
            },
               process.env.JWT_KEY ?? '',
            {
                expiresIn: '6h'
            }    
            );

            if(result)
                resolve(token)
                reject('Senha inválida')
        })

    })
        
}