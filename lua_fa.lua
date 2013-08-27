-- 用户跟踪cookie名为_n3fa_cid
local uid = ngx.var.cookie__n3fa_cid        
if not uid then
    -- 如果没有则生成一个跟踪cookie，算法为md5(时间戳+IP+客户端信息)
    uid = ngx.md5(ngx.now() .. ngx.var.remote_addr .. ngx.var.http_user_agent)
end 
local expires = 3600 * 24 * 365  -- 1 year
ngx.header['Set-Cookie'] = {'_n3fa_cid=' .. uid .. '; path=/;Expires=' .. ngx.cookie_time(ngx.time() + expires) .. '; Domain=10010.com;'}
if ngx.var.arg_domain then
-- 通过subrequest到/i-log记录日志，将参数和用户跟踪cookie带过去
    ngx.location.capture('/i-log?' .. ngx.var.args .. '&utrace=' .. uid)
end



local redis = require "resty.redis"
local red = redis:new()

red:set_timeout(1000) -- 1 sec

-- or connect to a unix domain socket file listened
-- by a redis server:
--     local ok, err = red:connect("unix:/path/to/redis.sock")

local ok, err = red:connect("127.0.0.1", 6379)
if not ok then
    ngx.log(ngx.ERR, "failed to connect:", err)
    return
end

--fa.js--

local n3fa_url_configs, err = red:hkeys("n3fa:url_configs")

if not n3fa_url_configs then
    ngx.log(ngx.ERR, "failed to get n3fa:url_configs: ", err)
    return
end

if n3fa_url_configs == ngx.null then
    ngx.log(ngx.DEBUG, "n3fa:url_configs not found.")
    return
end

local referer = ngx.req.get_headers().referer

if not referer then
    ngx.log(ngx.DEBUG,"referer not found.")
    return
end 

for i, url in ipairs(n3fa_url_configs) do
    local m, err = ngx.re.match(referer, url)
    if m then   
        local script_key, err = red:hget("n3fa:url_configs",url)
        if not script_key then
            return
        end
        local script_value, err = red:hget("n3fa:javascripts",script_key)  
        ngx.say(script_value);                   
    else
        if err then
            ngx.log(ngx.ERR, "ngx re match error: ", err)
            return
        end
    end
end  

--fa.js--       

red:close()          
