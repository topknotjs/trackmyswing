//Add error logging
class Account{
    constructor(data){
        if(!data) return;
        //console.log(data);
        if(!this.ValidateAccount(data)){
            return;
        }
        this.Email = "";
        this.FirstName = "";
        this.LastName = "";
        this.ProfileImageUrl = "";
        this.Wscid = null;
        this._error = false;
        this.ProcessAccount(data);
    }
    toJSON(){
        return {
            Email: this.Email,
            FirstName: this.FirstName,
            LastName: this.LastName,
            ProfileImageUrl: this.ProfileImageUrl,
            Wscid: this.Wscid
        };
    } 
    ProcessAccount(data){
        this.Email = (data.hasOwnProperty('email')) ? data.email : "";
        this.FirstName = (data.hasOwnProperty('firstName')) ? data.firstName : "";
        this.LastName = (data.hasOwnProperty('lastName')) ? data.lastName : "";
        this.ProfileImageUrl = (data.hasOwnProperty('profileImageUrl')) ? data.profileImageUrl : "";
        this.Wscid = (data.hasOwnProperty('wscid')) ? data.wscid : "";
        console.log(this);
    }
    ValidateAccount(data){
        return true;
    }
    HasError(){
        return this._error;
    }
}
module.exports = Account;