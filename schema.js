var Schema = {
  discounts: {
    prodcut_name: {type: 'string', nullable: false},
    image: {type: 'string', maxlength: 500, nullable: true},
    discount: {type: 'integer',nullable: false},
    price: {type: 'float', nullable: false},
    region: {type: 'string', nullable: false}
  },
  sales: {
        id: {type: 'integer', nullable: false, primary: true},
        cost: {type: 'decimal', maxlength: 20, nullable: true},
        sales: {type: 'decimal', maxlength: 20, nullable: true},
        item: {type: 'string', maxlength: 50, nullable: true}
  }
};
module.exports = Schema;

