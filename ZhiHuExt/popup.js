function rfs()
{
    chrome.runtime.sendMessage({ action: "stat" }, function(data)
    {
        if (data == null)
        {
            console.log("callback get error", chrome.runtime.lastError);
            return;
        }
        console.log(data);
        var objtab = $("#stat");
        objtab.empty();
        Object.keys(data).forEach((name) =>
        {
            var row = "<tr><td width='40%'>" + name + "</td><td>" + data[name] + "</td></tr>";
            objtab.append(row);
        });
    });
}

$(document).on("click", "button#rfs", rfs);
$(document).on("click", "button.openpage", e =>
{
    const dest = e.target.dataset.htmlname;
    chrome.runtime.sendMessage({ action: "openpage", isBackground: false, target: dest+".html" });
});
$("#upd").click(e =>
{
    chrome.runtime.sendMessage({ action: "openpage", isBackground: false, target: "https://github.com/XZiar/ZhiHuExt/releases" });
})
$(document).ready(() =>
{
    //rfs();
});

function verToStr(ver)
{
    return `v${Math.floor(ver / 10000)}.${Math.floor((ver % 10000) / 10)}.${ver % 10}`;
}
chrome.runtime.sendMessage({ action: "chkver" }, resp =>
{
    $("#curver").text(verToStr(resp.curver));
    $("#newver").text(verToStr(resp.newver));
    if (curver < newver)
    {
        $("#newver")[0].style.color = "red";
        $("#upd").show();
    }
});

