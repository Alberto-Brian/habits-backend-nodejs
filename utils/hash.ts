import bcrypt from 'bcrypt';

export default (password: string) => {
    return new Promise(async(resolve, reject) => {
        try {
            bcrypt.hash(password, 10, (error, hash) => {
                if(error) reject(error);
                if(hash) resolve(hash);
            })
        } catch (error) {   
            reject(error);
        }
    })
}


