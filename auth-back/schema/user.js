const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken } = require("../auth/generateTokens");
const getUserInfo = require("../lib/getUserInfo");
const Token = require("../schema/token");

const userSchema = new mongoose.Schema({
    id: { type: Object },  // Considera si realmente necesitas esta propiedad adicional
    name: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    apellido: { type: String, required: true },
    pais: { type: String, required: true },
    email: { type: String, required: true },
    cedula: { type: String, required: true },
    password: { type: String, required: true },
    fechaNacimiento: { type: Date, required: true },
    role: {
        type: String,
        enum: ['user', 'Jefe Planta', 'Tanquero', 'Codificador', 'rol3'], // Incluye los roles permitidos
        default: 'user', // Asigna un rol por defecto
    },
});

userSchema.pre('save', function (next) {
    if (this.isModified('password') || this.isNew) {
        const document = this;
        bcrypt.hash(document.password, 10, (err, hash) => {
            if (err) {
                next(err);
            } else {
                document.password = hash;
                next();
            }
        });
    } else {
        next();
    }
});

userSchema.methods.usernameExists = async function (userName) {
    const result = await mongoose.model("user").find({ userName: userName });
    return result.length > 0;
};

userSchema.methods.comparePassword = async function (password, hash) {
    return await bcrypt.compare(password, hash);
};

userSchema.methods.createAccessToken = function () {
    return generateAccessToken({
        ...getUserInfo(this),
        role: this.role,
    });
};

userSchema.methods.createRefreshToken = async function () {
    const refreshToken = generateRefreshToken(getUserInfo(this));

    try {
        const token = new Token({ token: refreshToken });
        await token.save();
        return refreshToken;
    } catch (error) {
        console.error(error);
        throw new Error("Error creating token");
    }
};

module.exports = mongoose.model("user", userSchema);
