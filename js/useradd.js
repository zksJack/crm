$(function () {
    let userId = null;
    // console.dir(window.location.href)
    let params = window.location.href.queryURLParams();
    if(params.hasOwnProperty("id")){
        userId = params.id;
        // 根据ID获取用户的信息，实现数据的回显
        getBaseInfo();
    }
    // 根据ID获取用户的信息，实现数据的回显
    // async 修饰的函数，最终返回的是promise
    async function getBaseInfo() {
        let result = await axios.get("/user/info",{
            params:{  userId  }
        })
        if(result.code === 0){
            // 给表单中塞数据，实现数据的回显
            result = result.data;
            $(".username").val(result.name);
            result.sex == 0 ? $("#man").prop('checked', true) : $("#woman").prop('checked', true);
            $(".useremail").val(result.email);
            $(".userphone").val(result.phone);
            $(".userdepartment").val(result.departmentId);
            $(".userjob").val(result.jobId);
            $(".userdesc").val(result.desc);
            return ;
        }
        alert("编辑不成功，可能是网络不给力....")
        userId = null;
    }
    initDeptAndJob();
    async function initDeptAndJob() {
        let departmentData = await queryDepart();
        let jobData = await queryJob();
        console.log(departmentData);
        console.log(jobData);
        if (departmentData.code === 0) {
            departmentData = departmentData.data;
            let str = ``;
            departmentData.forEach(item => {
                str += `<option value = "${item.id}">${item.name}</option>`;
            });
            $(".userdepartment").html(str);
        }
        if (jobData.code === 0) {
            jobData = jobData.data;
            let str = ``;
            jobData.forEach(item => {
                str += `<option value ="${item.id}">${item.name}</option>`
            });
            $(".userjob").html(str);
        }
    }
    function checkname() {
        let val = $(".username").val().trim();
        if (val.length === 0) {
            $(".spanusername").html("此项为必填项");
            return false;
        }
        if (!/^[\u4e00-\u9fa5]{2,10}$/.test(val)) {
            $(".spanusername").html("名字必须是2-10个汉字");
            return false;
        }
        $(".spanusername").html("这名字很ok");
        return true;
    }
    function checkemail() {
        let val = $(".useremail").val().trim();
        if (val.length === 0) {
            $(".spanuseremail").html("此项为必填项");
            return false;
        }
        if (!/^([a-zA-Z0-9]+[_|\_|\_.]?)*[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(val)) {
            $(".spanuseremail").html("请邮箱检查格式");
            return false;
        }
        $(".spanuseremail").html("这邮箱很ok");
        return true;
    }
    function checkphone() {
        let val = $(".userphone").val().trim();
        if (val.length === 0) {
            $(".spanuserphone").html("此项为必填项");
            return false;
        }
        if (!/^[1][3,4,5,7,8,9][0-9]{9}$/.test(val)) {
            $(".spanuserphone").html("请检查手机号格式");
            return false;
        }
        $(".spanuserphone").html("这手机很ok");
        return true;
    }
    $(".username").blur(checkname);
    $(".useremail").blur(checkemail);
    $(".userphone").blur(checkphone);

    $(".submit").click(async function () {
        if (!checkname() || !checkemail() || checkphone()) {
            alert("你的数据不合法")
            return;
        }
        let params = {
            name: $(".username").val().trim(),
            sex: $("#man").prop("checked") ? 0 : 1, // sex值要么是0  要么是1  0代表男   1代表女
            email: $(".useremail").val().trim(),
            phone: $(".userphone").val().trim(),
            departmentId: $(".userdepartment").val(),
            jobId: $(".userjob").val(),
            desc: $(".userdesc").val().trim()
        }
        判断是编辑还是新增
        if (userId) {
            params.userId = userId;
            // 编辑
            let result = await axios.post("/user/update", params)
            if (result.code === 0) {
                alert("修改数据成功")
                window.location.href = "userlist.html"
                return;
            }
            alert("网络不给力，稍后再试~")
            return; // 如果编辑了，程序就结束了，写个return
        }
        // 实现新增
        let result = await axios.post("/user/add", params)
        if (result.code === 0) {
            alert("添加员工成功~");
            window.location.href = "userlist.html"
            return;
        }
        alert("网络不给力，稍后再试~")
    })

})