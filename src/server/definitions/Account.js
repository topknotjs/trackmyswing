//Add error logging
class Account{
    constructor(data){
        if(!data) return;
        //console.log(data);
        this.Email = "";
        this.FirstName = "";
        this.LastName = "";
        this.ProfileImageUrl = "";
        this.wscid = null;
        this.ProcessAccount(data);
    } 
    ProcessContact(text){
        
    }
}
module.exports = Account;