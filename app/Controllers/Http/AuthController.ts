import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import User from 'App/Models/User';
import Database from '@ioc:Adonis/Lucid/Database'

export default class AuthController {

    public async daftar ({request, response}:HttpContextContract){

        const req = await request.validate({
            // form validasi
            schema:schema.create({
                nama: schema.string(),
                email: schema.string({},[
                    rules.email()
                ]),
                password: schema.string({},[
                    rules.confirmed()
                ])
                
            }),
            messages: {
                'nama.required': 'Nama tidak boleh kosong',
                'email.required': 'Email tidak boleh kosong',
                'password.required': 'Password tidak boleh kosong',
            }
        })

        // gunakan transaction
        const transaction = await Database.transaction()
        const user = new User()

        try {
            await transaction
                user.nama = req.nama
                user.email = req.email
                user.password = req.password

                user.save()
            await transaction.commit()
        }
        catch (error) {
            await transaction.rollback()
        }

        return response.redirect('/')
    }

    public async login({request, auth, response}:HttpContextContract) {
        
        const req = await request.validate({
            // form validasi
            schema:schema.create({
                email: schema.string({},[
                    rules.email()
                ]),
                password: schema.string()
                
            }),
            messages: {
                'email.required': 'Email tidak boleh kosong',
                'password.required': 'Password tidak boleh kosong',
            }
        })

        const email = req.email
        const password = req.password
        await auth.attempt(email, password)

        return response.redirect('/profil')
    }

    public async logout({auth, response}:HttpContextContract) {
        await auth.logout()
        return response.redirect('/')
    }
    
}
