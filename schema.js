var Schema = {
  discounts: {
    prodcut_name: {type: 'string', nullable: false},
    image: {type: 'string', maxlength: 500, nullable: true},
    discount: {type: 'integer',nullable: false},
    price: {type: 'float', nullable: false},
    region: {type: 'string', nullable: false}
  }
};
module.exports = Schema;

