var mysql = require('mysql');

module.exports = {
    Handle: null,
    Connect: function(callback) {
        this.Handle = mysql.createPool({
            host			:	"localhost",
            user			: 	"root",
            password		: 	"",
            database		:	"bkrp",
            debug: false
        });
        callback();
    },
    Characters: {
        getSqlIdByName: (name, callback) => {
            DB.Handle.query("SELECT id FROM characters WHERE name=?", [name], (e, result) => {
                if (result.length > 0) callback(result[0].id);
                else callback(0);
            });
        }
    }
};
