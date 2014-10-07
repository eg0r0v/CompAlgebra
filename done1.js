<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">

<html lang = "en">
<head>
  <meta charset="utf-8">
  
  <title>Egorov Ilya 401</title>
  
  <style>

  .node circle {
    fill: #fff;
    stroke: steelblue;
    stroke-width: 3px;
  }

  .node text { font: 16px sans-serif; }

  .link {
    fill: none;
    stroke: #ccc;
    stroke-width: 2px;
  }
  
   </style>
</head>

<body topmargin="50%" leftmargin="50%" rightmargin="50%" bottommargin="50%" marginheight="0" marginwidth="0" text="black" link="#B10006" alink="red" vlink="maroon">

  <p> Добрый день! Можно вводить:
   <br> - числа, в том числе и дробные,
   <br> - буквы, русские и английские,
   <br> - операции сложения, вычитания, умножения, деления и степени
    <br> - четыре вида скобок: (), <>, {}, [] <br><br> Enjoy!</p> 
<!-- load the d3.js library -->  
<script src="http://d3js.org/d3.v3.min.js"></script>
   
<script>

  function main () {
    
  var line = (document.getElementById('userquery')).value;
  var position = 0;
  
  function stringCheck() {  
    var i = 0;
    while ( i < line.length)
    {
      if (line[i] == '{' || line[i] == '[' || line[i] == '<') line = line.replace(line[i],"(");
      if (line[i] == '}' || line[i] == ']' || line[i] == '>') line = line.replace(line[i],")");
      
      if (line[i] == ',') line = line.replace(line[i],".");
      
      if ((line[i] < '0' || line[i] > '9') && 
          (line[i] < 'а' || line[i] > 'я') &&
          (line[i] < 'А' || line[i] > 'Я') &&
          (line[i] < 'a' || line[i] > 'z') &&
          (line[i] < 'A' || line[i] > 'Z') &&
          line[i] != '.' && line[i] != '+' &&
          line[i] != '*' && line[i] != '/' &&
          line[i] != '^' && line[i] != ')' &&
          line[i] != '-' && line[i] != '(' &&
          line[i] != ' ')
      {
        alert ("В строке недопустимый символ! " + line[i] );
        return false;
      }
      i++;
    }
    i = 0;
    while(i < line.length) {
        if (line[i] == ' ') 
        {line = line.substring(0,i) + line.substring(i+1); i--;}
      else i++;
      }
    return true;
  }
  
  
  
  var correctstring = stringCheck();
  if(!correctstring) {
    alert("Wrong characters in query!");
    return;
  } else {
    var root = AcceptString();
    if (root.name == "") {
      alert ("Wrong query!"); 
      return;
   }   
   d3.select("svg")
                .remove();
  }        
     
    
  function AcceptString() {
    line += "#";
    var parsed = ParseS();
    if (parsed.name != "" && line[position] == '#') {
      return parsed;
    }
    return ({"name":"","parent":"null","children":[]});
  }
   
  function ParseS() { 
    var parsed = ParseA();
    while (line[position] == '+' || line[position] == '-') {
      var op = line[position];
      position++;
      var plumin = ParseA();
      if (parsed.name!="" && plumin.name!="") {
        var child = parsed;
        parsed = ({"name": op,"parent":"null","children":[child,plumin]});  
        child.parent = parsed.name;
        plumin.parent = parsed.name;
      }
      else return ({"name":"","parent":"null","children":[]});
    }
    return parsed;
  }

  function ParseA() {
    var parsed = ParseB();
    while (line[position] == '*' || line[position] == '/') {
      var op = line[position];
      position++;
      var muldiv = ParseB();
      if (parsed.name!="" && muldiv.name!="") {
        var child = parsed;
        parsed = ({"name":op,"parent":"null","children":[child,muldiv]});
        child.parent = parsed.name;
        muldiv.parent = parsed.name;
      }
      else return ({"name":"","parent":"null","children":[]});
    }
    return parsed;
  }
  
  function ParseB() {
    var parsed = ParseC();
    while (line[position] == '^') {
      position++;
      var pow = ParseC();
      if (parsed.name!="" && pow.name!="") {
        var child = parsed;
        parsed = ({"name":"^","parent":"null","children":[child,pow]});  
        child.parent = parsed.name;
        pow.parent = parsed.name;
      }
      else return ({"name":"","parent":"null","children":[]});
    }
    return parsed;
  }
  
  function ParseC() {
    var parsed = false;
    if (line[position] == '(') {
      position++;
      parsed = ParseS();
      if (line[position] != ')')
        return false;
      else position++;
    }
    else {
      parsed = ParseE();
    }
    return parsed;
  }

  function ParseE() {
    var name = "";
    
    while (  line[position] >= '0' && line[position] <= '9' ||
        line[position] >= 'а' && line[position] <= 'я' ||
        line[position] >= 'А' && line[position] <= 'Я' ||
        line[position] >= 'a' && line[position] <= 'z' ||
        line[position] >= 'A' && line[position] <= 'Z' ||
        line[position] == '.') {
        name += line[position];
        position++;
    }
    var node =({"name":name,"parent":"null","children":[]});  
    return node;  
  }




  // ************** Generate the tree diagram   *****************
  var margin = {top: 40, right: 120, bottom: 20, left: 120},
    width = 960 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;
    
  var i = 0;

  var tree = d3.layout.tree()
    .size([height, width]);

  var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.x, d.y]; });

  var svg = d3.select("body").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  //********//    
   
  update(root);

  function update(source) {

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 100; });

    // Declare the nodesвЂ¦
    var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

    // Enter the nodes.
    var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { 
        return "translate(" + d.x + "," + d.y + ")"; });

    nodeEnter.append("circle")
      .attr("r", 10)
      .style("fill", "#fff");

    nodeEnter.append("text")
      .attr("y", function(d) { 
        return d.children || d._children ? -18 : 18; })
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.name; })
      .style("fill-opacity", 1);

    // Declare the linksвЂ¦
    var link = svg.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });

    // Enter the links.
    link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", diagonal);

  }
}
  
</script>

  
<p><input type="text" id="userquery" size = "36" autocapitalize="off" spellcheck="false" value="{piggie+piggie+piggie] + <brick*4808>-wolf" onchange="" onkeydown="">
   <button onclick="main()">Построить!</button></p>

  <!-- <img src ="https://pp.vk.me/c4463/u2989826/-6/x_47821ea9.jpg" align = "center"> -->
</body>
</html>