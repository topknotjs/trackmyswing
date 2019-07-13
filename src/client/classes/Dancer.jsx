export default class Dancer {
  constructor(data) {
    console.log('processing dancer: ', data);
    // TODO: This needs to be handled conditiionally depending on what is actually returned.
    this.account = {
      accountId: data.accountId,
      firstName: data.firstName,
      lastName: data.lastName,
      facebookId: data.facebookId,
      location: data.location,
      qualifiesforNextDivision: data.qualifiesforNextDivision,
      profileImageUrl: data.profileImageUrl,
    };
    this.wsdc = {
      wsdcId: data.wsdcDancer.wsdcId,
      firstName: data.wsdcDancer.firstName,
      lastName: data.wsdcDancer.lastName,
      currentPoints: data.wsdcDancer.currentPoints,
      division: data.wsdcDancer.division,
      role: data.wsdcDancer.role,
      relevance: data.wsdcDancer.relevance,
      qualifiesForNextDivision: data.wsdcDancer.qualifiesForNextDivision,
      divisionRoleQualifies: data.wsdcDancer.divisionRoleQualifies,
    };
    this.attendances = data.wsdcDancer.attendances;
    this.record = data.wsdcDancer.record;
  }
  hasAccount() {}
}
