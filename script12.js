<p><input type="text" id="userquery" autocapitalize="off" spellcheck="false" value="4+4*4">
    <button onclick="main()">Ðàçáîð</button></p>
	
<script>

function stringCheck(str) //ïðîâåðêà íà÷àëüíîé ñòðîêè íà âîçìîæíûå íåäîðàçóìåíèÿ
{	
	var line = str.callee;
	var i = 0;
	while ( i < line.size())
	{
		if (line[i] == '{' || line[i] == '[' || line[i] == '<') line[i] = '('; //çàìåíÿåì ñêîáêè
		if (line[i] == '}' || line[i] == ']' || line[i] == '>') line[i] = ')';

		if (line[i] == ',') line[i] = '.';

		if ((line[i] < '0' || line[i] > '9') && //ïðîâåðêà íà âñå îñòàâøèåñÿ äîïóñòèìûå ñèìâîëû
			(line[i] < 'a' || line[i] > 'z') &&
			(line[i] < 'A' || line[i] > 'Z') &&
			line[i] != '.' && line[i] != '+' &&
			line[i] != '*' && line[i] != '/' &&
			line[i] != '^' && line[i] != ')' &&
			line[i] != '-' && line[i] != '(' &&
			line[i] != ' ')
		{
			alert ("Â ÷èñëå - ïîñòîðîííèé ñèìâîë! " + line[i] );
			return false;
		}
	}
	i = 0
	for(unsigned i = 0; i < line.size(); i++)
	{
		if (line[i] == ' ')			//óáèðàåì äóáëèðóþùèå ïðîáåëû
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


function main () {
	var line = document.getElementById('userquery').value;
	var correctstring = stringCheck(line);
	if(!correctstring) {
		alert("Wrong query!");
	} else {
		AcceptString(line);
	}
	
	function AcceptString(str) {
		line = str.callee;
		var position = 0;
		line += "#";
		var parsed = ParseA(line, position);
		while (line[position] == '+' || line[position] == '-') {
			position++;
			parsed = parsed && ParseA(line,position);
		}
		return parsed && line[position] == '#';
	}

	function ParseA(str, pos) {
		var position = pos.callee;
		var line = str.callee;
		var parsed = ParseB(line, position);
		while (line[position] == '*' || line[position] == '/') {
			position++;
			parsed = parsed && ParseB(line,position);
		}
		return parsed;
	}
	
	function ParseB(str, pos) {
		var position = pos.callee;
		var line = str.callee;
		var parsed = ParseC(line, position);
		while (line[position] == '^') {
			position++;
			parsed = parsed && ParseC(line,position);
		}
		return parsed;
	}
	
	function ParseB(str, pos) {
		var position = pos.callee;
		var line = str.callee;
		var parsed = ParseC(line, position);
		while (line[position] == '^') {
			position++;
			parsed = parsed && ParseC(line,position);
		}
		return parsed;
	}
	
	function ParseС(str, pos) {
		var position = pos.callee;
		var line = str.callee;
		var parsed = false;
		if (line[position] == '(') {
			position++;
			parsed = ParseS(line,position);
			if (line[position] != ')')
				return false;
			else position++;
		}
		else {
			parsed = ParseE(line, position);
		}
		return parsed;
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
