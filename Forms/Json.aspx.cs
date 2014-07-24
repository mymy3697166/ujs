using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Script.Serialization;

public partial class Forms_Json : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }
    protected override void OnPreInit(EventArgs e)
    {
        JavaScriptSerializer jss = new JavaScriptSerializer();
        List<object> list = new List<object>();
        list.Add(new { id = 1, name = "张家辉", dob = new DateTime(1969, 10, 9), gender = "F" });
        list.Add(new { id = 2, name = "黄晓明", dob = new DateTime(1983, 11, 9), gender = "F" });
        list.Add(new { id = 3, name = "刘德华", dob = new DateTime(1965, 11, 9), gender = "F" });
        list.Add(new { id = 4, name = "郭富城", dob = new DateTime(1972, 11, 9), gender = "F" });
        list.Add(new { id = 5, name = "黎明", dob = new DateTime(1971, 11, 9), gender = "F" });
        list.Add(new { id = 6, name = "张学友", dob = new DateTime(1968, 11, 9), gender = "F" });
        list.Add(new { id = 7, name = "杨幂", dob = new DateTime(1987, 11, 9), gender = "M" });
        list.Add(new { id = 8, name = "刘亦菲", dob = new DateTime(1986, 11, 9), gender = "M" });
        list.Add(new { id = 9, name = "刘诗诗", dob = new DateTime(1986, 11, 9), gender = "M" });
        list.Add(new { id = 10, name = "陆毅", dob = new DateTime(1982, 11, 9), gender = "F" });
        list.Add(new { id = 11, name = "陈道明", dob = new DateTime(1961, 11, 9), gender = "F" });
        list.Add(new { id = 12, name = "张国立", dob = new DateTime(1958, 11, 9), gender = "F" });
        list.Add(new { id = 13, name = "张铁林", dob = new DateTime(1960, 11, 9), gender = "F" });
        list.Add(new { id = 14, name = "文章", dob = new DateTime(1984, 11, 9), gender = "F" });
        list.Add(new { id = 15, name = "马伊俐", dob = new DateTime(1977, 11, 9), gender = "F" });
        int page = Convert.ToInt32(string.IsNullOrEmpty(Request.Form["page"]) ? "0" : Request.Form["page"]);
        int rows = Convert.ToInt32(string.IsNullOrEmpty(Request.Form["rows"]) ? list.Count.ToString() : Request.Form["rows"]);
        string json = jss.Serialize(new { total = list.Count, data = list.Skip<object>(page * rows).Take<object>(rows) });
        Response.ContentType = "application/json";
        Response.Write(json);
        Response.End();
        base.OnPreInit(e);
    }
}