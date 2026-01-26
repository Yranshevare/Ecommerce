import jwt from 'jsonwebtoken'

export function generateRefreshToken(payload:object) {

    return jwt.sign({payload}, process.env.REFRESH_TOKEN_SECRET!,{
        expiresIn:"1d"
    })
}


export function verifyRefreshToken(token:string ) {

    try {
        const decoded:any = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!)
        // console.log(decoded,"lll")
        return decoded.payload.email === process.env.ADMIN_EMAIL
    } catch (error:any) {
        return ({
            message:"error while decoding the refresh token",
            status:400,
            error:error.message
        })
    }
}