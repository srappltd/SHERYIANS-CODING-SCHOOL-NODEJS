
// client midlleware
const clientLogout = (req,res,next)=>{
    try {
        if(req.session.user){
        
        }else{
            res.redirect("/signin")
        }
        next()
    } catch (error) {
        
    }
}
const clientLogin = (req,res,next)=>{
    try {
        if(req.session.user){
            res.redirect("/deshboard")
        }else{
        }
        next()
    } catch (error) {
        
    }
}

// client midlleware
const adminLogout = (req,res,next)=>{
    if(req.session.admin){
        
    }else{
        res.redirect("/admin")
    }
    next()
}
const adminLogin = (req,res,next)=>{
    if(req.session.admin){
        res.redirect("admin/deshboard")
    }else{
    }
    next()
}

module.exports = {clientLogin,clientLogout,adminLogin,adminLogout}