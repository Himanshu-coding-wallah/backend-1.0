# CORS
CORS is a browser security mechanism that allows servers to specify which origins are allowed to access their resources using HTTP headers.

## Origin
An origin = protocol + domain + port  
> - These all three must be same in order to be same origin, if anyone of them is different than different origin.  
> - Path is not considered here

## What Problem Does CORS Solve?
The browser is a shared environment.  
we might have:  
Banking tab  
Gmail tab
Shopping tab  
Random blog tab

All running JavaScript.

Without origin isolation,
any tab could access another tab’s data because browsers automatically attack cookies, sessions data. That is why browsers follow same origin policy
> Same origin policy (SOP) says A website can only make requests to the same origin it was loaded from.
- Backends can allow who can access

## Allowing cross origins
Only in the case of   
GET  
POST  

"Access-Control-Allow-Origin"  
This allows single or multiple origins to access resourses.  
We can add this in the response header
```
http header{
    Access-Control-Allow-Origin : https://google.com | *
}
```
" * " wildcard tells browsers to allow any origin to access the resource.

``` 
NOTE->  
By default cross origin access do not send cookies.  
We can do it by --   
{ credentials: include }  

But if we allow cookies than we cannot use * in Access-control-allow-origin .
We have to add a specific origin
```


Methods other than GET, POST, HEAD we have preflight requests 
## Preflight Requests
For methods like PUT, DELETE, PATCH  
```
It’s a “permission check” sent by the browser using an OPTIONS request before sending certain cross-origin requests.
```
```
A preflight request is an OPTIONS request sent by the browser before the actual cross-origin request to verify that the server allows the request method and headers.
```

### Why does it exists
Because some HTTP requests can:  
- Modify data (PUT, DELETE, PATCH)  
- Send custom headers
- Send non-simple content types (like JSON)

These can potentially affect user data.

### Preflight triggers when
1. Method is NOT simple i.e. different from GET, POST, HEAD
2. Custom Headers Are Used
3. Content-Type Is NOT Simple

> NOTE -> CORS is a browser security mechanism . i.e. communication between servers is without CORS 