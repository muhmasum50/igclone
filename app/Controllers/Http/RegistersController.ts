import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator';

export default class RegistersController {

    public async store ({request}:HttpContextContract){

        const req = await request.validate({
            schema:schema.create({
                // form validasi
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

        console.log(req)

        return request.all();
    }
}
