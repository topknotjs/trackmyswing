// TODO: Add error logging
// TODO: Change wscid to wsdcid
class Account{
    constructor(data){
        if(!data) return;
        //console.log(data);
        if(!this.ValidateAccount(data)){
            return;
        }
        this.Username = "";
        this.Email = "";
        this.FirstName = "";
        this.LastName = "";
        this.ProfileImageUrl = "";
        this.Wscid = null;
        this.FacebookId = null;
        this.Location = "";
        this._error = false;
        this.ProcessAccount(data);
    }
    toJSON(){
        return {
            Username: this.Username,
            Email: this.Email,
            FirstName: this.FirstName,
            LastName: this.LastName,
            ProfileImageUrl: this.ProfileImageUrl,
            Wscid: this.Wscid,
            FacebookId: this.FacebookId,
            Location: this.Location
        };
    } 
    ProcessAccount(data){
        this.Username = (data.hasOwnProperty('userName')) ? data.userName : "";
        this.Email = (data.hasOwnProperty('email')) ? data.email : "";
        this.FirstName = (data.hasOwnProperty('firstName')) ? data.firstName : "";
        this.LastName = (data.hasOwnProperty('lastName')) ? data.lastName : "";
        this.ProfileImageUrl = (data.hasOwnProperty('profileImageUrl')) ? data.profileImageUrl : "";
        this.Wscid = (data.hasOwnProperty('wsdcid')) ? data.wsdcid : "";
        this.FacebookId = (data.hasOwnProperty('facebookId')) ? data.facebookId : "";
        this.Location = (data.hasOwnProperty('location')) ? data.location : "";
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