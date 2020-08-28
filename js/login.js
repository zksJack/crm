$(function(){
    $(".submit").click(async function(e){
        let account = $(".userName").val().trim();
        console.log(account);
        let password = $(".userPass").val().trim();
        if(account === "" || password === ""){
            alert("账号密码不能为空");
            return ;
        }
        //正则验证 后期完善
        //密码加密
        password= md5(password);
        console.log(password);
        let result = await axios.post("/user/login",{account,password});
        console.log(result);
        if(parseInt(result.code) === 0){
            alert("登录成功");
            window.location.href = "index.html";
            return ;
        }
        alert("用户或密码错误");
    })
})