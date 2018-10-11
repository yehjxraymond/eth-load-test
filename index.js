import http from "k6/http";

export default function() {
    let response = http.get("https://test.loadimpact.com");
};