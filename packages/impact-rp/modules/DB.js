var mysql = require('mysql');

module.exports = {
    Handle: null,
    Connect: function(callback) {
        this.Handle = mysql.createPool({
            host			:	"mysql-mariadb14-104.zap-hosting.com",
            user			: 	"zap433884-2",
            password		: 	"igTWZ2p4642pw5N4  ",
            database		:	"zap433884-2",
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
