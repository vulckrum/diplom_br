class RegenerateTempCode {
    constructor(targetElementClick,loginInput){
        this.targetElementClick = targetElementClick;
        this.loginInput = loginInput;
    }
    init() {
        let Elements = document.querySelectorAll(this.targetElementClick);
        Elements.forEach((item)=>{
            item.addEventListener('click',(e)=>{
                this.sendData();
            })
        })
    }
    async sendData() {
        const formData = new FormData();
        const response = await fetch('/regenTempCode', {
            method: 'POST',
            body: JSON.stringify({login:this.getLogin()}),
            headers: {
                'Content-Type': 'application/json'
              },
        });
        const result = await response
        if(result.staus === 200){
            return response.json();
        }else{
            return response.json().errors
        }
        
    }
    getLogin(){
        return document.querySelector(this.loginInput).value;
    }
}
const RTC = new RegenerateTempCode('#regenTempCode','[name="login"]')
RTC.init()