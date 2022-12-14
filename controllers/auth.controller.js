import {User} from "../models/User.js";
import { generateToken } from "../helpers/tokenManager.js";
import { Role } from "../models/Role.js";

export const register = async (req, res) =>{
    const {nombreCompleto,telefono,email, password,nombreOficina, roles} = req.body;
       try {
        //buscar por email
        let user = await User.findOne({email})
        if (user) throw {code: 11000}
    
        user = new User({nombreCompleto,telefono,email, password,nombreOficina});
//comprobar si estan enviando roles
        if (roles) {
            const foundRoles = await Role.find({name: {$in: roles}})
            user.roles = foundRoles.map(role => role._id)
        } else {
            const role = await Role.findOne({name: "user"})
            user.roles = [role._id];
        }
        await user.save();
        console.log(user);
//jsonwebtoken
        const {token, expiresIn} = generateToken(user.id);
        // generateRefreshToken(user.id, res);
       // generateRefreshToken (user.id, res);
        return res.status(201).json({token, expiresIn});
    } catch (error) {
        console.log(error.code);
        // alternativa buscando por defecto mongoose
        if (error.code === 11000) {
            return res.status(400).json({error: 'ya existe este usuario'});
        }
        return res.status(500).json({error: "error de servidor"});
    }
    
        
    
    
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        let user = await User.findOne({email}).populate({ 
            path:'roles'
          /*  ,
            populate: {
                path: 'employees'
            }
        }) .then(user => {
      res.json(user); */
   });;
        console.log(user)
        if (!user) 
            return res.status(403).json({ error: "el usuario no existe"});

        const respuestaPassword = await user.comparePassword(password);
        if (!respuestaPassword) return res.status(403).json({error: "contraseña incorrecta"});

        //generar el token JWT
        const {token, expiresIn} = generateToken(user.id);

        //generateRefreshToken(user._id, res)

        return res.json({token, expiresIn, user});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "error de servidor"});
    }
}
/*
export const refreshToken = (req, res) =>{
    try {
            const { token, expiresIn} = generateToken(req.uid);
            return res.json({ token, expiresIn });
    } catch (error) {
      console.log(error);  
      return res.status(500).json({error: "error de servidor"});
    }
}*/
//cierre de sesion
/*
export const logout = (req, res) => {
    //res.clearCookie('token');
    jwt.destroy(token);
    res.json({ ok: true});
}*/
//cierre de sesion
export const logout = (req, res) => {
    res.clearCookie('token');
    res.json({ ok: true});
}



/*
export const register = async (req,res) => {
const { email, password, roles} = req.body;
    try {
         
        //buscar por email
        let user = await User.findOne({email})
        if (user) throw {code: 11000}
        
        user = new User({email,password});
//comprobar si estan enviando roles
        if (roles) {
            const foundRoles = await Role.find({name: {$in: roles}})
            user.roles = foundRoles.map(role => role._id)
        } else {
            const role = await Role.findOne({name: "user"})
            user.roles = [role._id];
        }
       // const foundEmployees = await Employee.find({name: {$in: employees}})
        //user.employees = foundEmployees.map(employee => employee._id)
        await user.save();
        console.log(user);
//jsonwebtoken
        const {token, expiresIn} = generateToken(user.id);
        return res.status(201).json({token, expiresIn});
    } catch (error) {
        console.log(error.code);
        // alternativa buscando por defecto mongoose
        if (error.code === 11000) {
            return res.status(400).json({error: 'ya existe este usuario'});
        }
        return res.status(500).json({error: "error de servidor"});
    }
    
}*/