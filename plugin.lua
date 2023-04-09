ngx.log(ngx.INFO, "Debugging message")
local res = ngx.location.capture("/")
if res.status == ngx.HTTP_OK then
    local content_type = res.header["Content-Type"]
    local content = res.body
    ngx.log(ngx.DEBUG, "Debugging message")
    ngx.log(ngx.DEBUG, content_type)
    -- Check if content type is HTML
    if string.match(content_type, "text/html") then
--                local new_content = string.gsub(content, "</body>", "\n<script src=\"/mmce_plugin_script.js\"></script></body>")
                        local new_content = string.gsub(content, "<head>", "<head>\n<script src=\"your_script.js\"></script>")

        ngx.header["Content-Length"] = string.len(new_content)
        ngx.say(new_content)
    else
        ngx.header["Content-Length"] = string.len(content)
        ngx.say(content)
    end
else
    ngx.exit(res.status)
end

