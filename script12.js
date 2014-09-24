<p><input type="text" id="userquery" autocapitalize="off" spellcheck="false" value="4+4*4">
    <button onclick="main()">Разбор</button></p>
	
<script>

function stringCheck(str) //проверка начальной строки на возможные недоразумения
{	
	var line = str.callee;
	var i = 0;
	while ( i < line.size())
	{
		if (line[i] == '{' || line[i] == '[' || line[i] == '<') line[i] = '('; //заменяем скобки
		if (line[i] == '}' || line[i] == ']' || line[i] == '>') line[i] = ')';

		if (line[i] == ',') line[i] = '.';

		if ((line[i] < '0' || line[i] > '9') && //проверка на все оставшиеся допустимые символы
			(line[i] < 'a' || line[i] > 'z') &&
			(line[i] < 'A' || line[i] > 'Z') &&
			line[i] != '.' && line[i] != '+' &&
			line[i] != '*' && line[i] != '/' &&
			line[i] != '^' && line[i] != ')' &&
			line[i] != '-' && line[i] != '(' &&
			line[i] != ' ')
		{
			alert ("В числе - посторонний символ! " + line[i] );
			return false;
		}
	}
	i = 0
	for(unsigned i = 0; i < line.size(); i++)
	{
		if (line[i] == ' ')			//убираем дублирующие пробелы
			{line.erase(i,1); i = 0;}
	}
	return true;
}

function isOperator (candidate) {
	if (candidate == '+' || candidate == '-' ||
		candidate =='*' || candidate == '/' ||
		candidate == '^') 
		return true;
	return false;
}
	
function ComparePriority (temp, stackop) {
	var temppriority = 1,
		stackoppriority = 1;
	if (temp == "*" || temp == "/") 		temppriority++;
	if (temp == "^")						temppriority=3;
	if (temp == "(") 						temppriority =0;
	if (stackop == "*" || stackop == "/")	stackoppriority++;
	if (stackop == "^")						stackoppriority=3;
	if (temp == "(") temppriority =0;
	if (temppriority > stackoppriority)
		return true;
	return false;
}




function main () {
	var Stack = "";
	var line = document.getElementById('userquery').value;
	var correctstring = stringCheck(line);

	function ParseToPostfix() {
		var result = [];
		var i = 0;
		while (i < line.length) {
			if (isOperator(line[i])) {
				
			
			
			}	
		}
		
	}

	// ************** Generate the tree diagram	 *****************
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
		root=tree[0];
		update(root);   

	function update(source) {

	  // Compute the new tree layout.
	  var nodes = tree.nodes(root).reverse(),
		  links = tree.links(nodes);

	  // Normalize for fixed-depth.
	  nodes.forEach(function(d) { d.y = d.depth * 100; });

	  // Declare the nodes…
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

	  // Declare the links…
	  var link = svg.selectAll("path.link")
		  .data(links, function(d) { return d.target.id; });

	  // Enter the links.
	  link.enter().insert("path", "g")
		  .attr("class", "link")
		  .attr("d", diagonal);

	}
}
</script>