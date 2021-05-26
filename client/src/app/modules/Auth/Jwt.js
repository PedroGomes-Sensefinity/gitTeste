import JwtDecode from 'jwt-decode';

const Jwt = {
    header: {
        apiUrl: process.env.REACT_APP_REST_API_URL + "jwt/",
        apiHeaders: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'no-cache',
            'Accept': 'application/json',
            'Version' : process.env.REACT_APP_REST_API_VERSION
        }
    },
    check: function(token){
        this.header.apiHeaders["Token"] = token
        fetch(this.header.apiUrl, {
            method: 'GET',
            headers: this.header.apiHeaders,
            mode: 'cors'
        })
        .then(function(response){
            if (response.status !== 200) {
                localStorage.removeItem('@sense/api/token');
                window.location.reload();          
                return false;
            } else {
                Jwt.tenant(token);
                return true;
            }        
        })
        .catch(function(err) {
            console.log(err);
            localStorage.removeItem('@sense/api/token');
            window.location.reload();
            return false;
        });
        return true;
    },
    auth: function(user, pwd){
        Jwt.header.apiHeaders["Authorization"] = 'Basic ' + btoa(user + ":" + pwd)jwt/
        fetch(Jwt.header.apiUrl, {
            method: 'GET',
            headers: Jwt.header.apiHeaders,
            mode: 'cors'
        })
        .then(function(response){
            if (response.status !== 200) {
                return [];
            } else {
                return response.json();
            }        
        })
        .then(function(data){
            var result = [];
            if (typeof data.data !== 'undefined') {
                result = data.data;
                Jwt.tenant(data.data.token[0].hash);
                localStorage.setItem('@sense/api/token', data.data.token[0].hash);
            } else {
                localStorage.removeItem('@sense/api/token');
            }
            return result;
        })
        .catch(function(err) {
            console.log(err);
            localStorage.removeItem('@sense/api/token');
            Error("Something went wrong on POST user auth ... ");
        });

    },
    tenant: function(hash){
        var decoded = JwtDecode(hash);
        if (typeof decoded.type !== 'undefined') {
            localStorage.setItem('@sense/api/user/type', decoded.type);
        } else {
            localStorage.removeItem('@sense/api/user/type');
        }
    }
}

export default Jwt;
