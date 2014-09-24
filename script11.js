<p><input type="text" id="code" autocapitalize="off" spellcheck="false" value="2+2" onchange="" onkeydown="">
    <button onclick="go()">���������</button></p>

	
var My_Stack {
public:
	My_Stack();				// ����������� �� ���������.
	void clear();			//������� �������
	void PrintD() const;
	void Push(char);		//���������� �������� � ����
	void Push(double);
	char Pop();				//�������� �������� �� �����
	double PopD();
	char ShowLast() const;	//������������ ���������� �������� ������������ ��� �������� �� �����
	bool Is_Empty() const;	//�������� ����� �� �������
	bool Is_DEmpty() const;
private:
	vector <char> home;		// "���������" ���������� � �����
	vector <double> dome;	//"���������" �����
};

int _tmain(int argc, _TCHAR* argv[])
{

	var line;
	var way;
	var wayout;		//��� ��������������� ������

	My_Stack stack; //��������� ���� ��� �������� ������

	var isMoved = true;
	var NumStr = 0;
	
		getline(in,line); //��������� ������
		NumStr++;
		cout << "������ " << NumStr << ": ";

		if (!line.empty())
		{
			stringCheck(line);

			for(int i = 0; i < line.size(); i++)
				if (line[i] == ' ')			//������� ��� �������
					{line.erase(i,1); i--;}

			for(unsigned i = 0; i < line.size() - 2; i++)
				if ( (line[i] == '+' || line[i] == '*' || //���� ������ ����� ���������
					line[i] == '/' || line[i] == '^' || line[i] == '-') 
					&& line[i+1] == line[i])
				{
					cout << "������! ��� ��������� ������ ��� ����� ����� ����!\n�������� �������� - " << line[i] << '\n';
					exit(1);
				}
			
			for(unsigned i = 0; i < line.size(); i++)
				if (line[i] == '-')			//�������� ������ �� #- ��� ����������� ������������ �����
				{
					line.insert(i,"#");
					i++;
				}

			for(unsigned i = 0; i < line.size() - 1; i++)
				if(line[i+1] == '#' && line[i] == ')') 	//���� ������� ����� ����� ����� ����������� ������ - �� ������� �����
				{
					line.insert(i+1,"+");
					i++;
				}

			do
			{
				isMoved = false; //�� ������� ��������� � ������� �������� ������
				if(line[0] == '(')
				{
					stack.Push(line[0]);	//��������� � ����
					line = line.substr(1, line.size());	//��������� ������ �� ���� ������
					isMoved = true;	//��������� ��������
				}
			
				if(line[0] == ')' && !isMoved)
				{
					if (stack.Is_Empty())	//���� ���� ���� - ������
					{
						cout << "������! ������� �� �������������� ��������!\n����� �� ���������..";
						exit(1);
					}
					else
						if(stack.ShowLast() == '(') //���� ��������� �������� - ����� ������
					{
							line = line.substr(1, line.size()); //������� �� ������
							stack.Pop();						//� ������� �� �����
							isMoved = true;
					}
					else if (stack.ShowLast() == '+' || //���� ��� ���� �� ������
						stack.ShowLast() == '*' ||
						stack.ShowLast() == '/' ||
						stack.ShowLast() == '^')
						{
							of << stack.Pop() << ' '; //��������� ���� � ������� � ����.
							isMoved = true;
						}
				}
				if(line[0] == '^' && !isMoved) //���� �������� � �� ����������� ���������
				{
					stack.Push(line[0]);	//���������
					line = line.substr(1, line.size()); //����������� ������.
					isMoved = true;		//������� ���������
				}	

				if(line[0] == '*' && !isMoved) //���� �������� � �� ����������� ���������
				{
					if (stack.Is_Empty() ||
						stack.ShowLast() == '+' ||
						stack.ShowLast() == '(' ||
						stack.ShowLast() == '^')
					{
						stack.Push(line[0]);
						line = line.substr(1,line.size());
						isMoved = true;
					}
					else
					if (stack.ShowLast() == '*' || stack.ShowLast() == '/') //���� �������� ����� �� �������
					{
						of << stack.Pop() << ' '; //��������� �������� �� ����� � ���
						isMoved = true;
					} 
				}

				if(line[0] == '/' && !isMoved) //����������
				{
					if (stack.Is_Empty() ||
						stack.ShowLast() == '+' ||
						stack.ShowLast() == '(' ||
						stack.ShowLast() == '^')
						{
							stack.Push(line[0]);
							line = line.substr(1,line.size());
							isMoved = true;
						}
					else 
					if (stack.ShowLast() == '*' || stack.ShowLast() == '/')
					{
						of << stack.Pop() << ' ';
						isMoved = true;
					}			
				}

				if(line[0] == '+' && !isMoved) //��������� - ����
				{
					if (stack.Is_Empty() ||
						stack.ShowLast() == '(' ||
						stack.ShowLast() == '^')
					{
						stack.Push(line[0]);
						line = line.substr(1,line.size());
						isMoved = true;
					} 
					else				
					if (stack.ShowLast() == '*' ||
						stack.ShowLast() == '+' ||
						stack.ShowLast() == '/')
					{
								of << stack.Pop() << ' '; //��������� ���� � ������� � ����.
								isMoved = true;
					} 
				}
			
			//��������� ��� �������� � ������. ������ ���� �����:
				if((line[0] >='0' && line[0] <= '9' || line[0] == '#') && !isMoved)
				{
					bool isDot = false, //����� �� �� ����� � ����� (��� ������������ �����)
					isPushed = true;//��������� �����
					string ToPush = "";//��������� ������ ��� ���������� � ���

					if (line.size() > 3 && line[0] == '#' && line[2] == '(')
						line.insert(2,"1*"); //��������� ������ �� ����� ����;

					if (line[0] == '#') 
					{
						ToPush = "-";
						line = line.substr(2, line.size());	//������� ������������� ���� #,
					}	//������� �� ����� �����, �������� � ��� ��� � �������������, � ����� �������� ����� � ToPush

					for (int i = 0; i < line.size(); i++)
					{
						isPushed = false; //���� �� ��������� �����

						if(line[i] == '.' && i != 0) //����� �� �� ������ �����
						{
							if(!isDot) 
							{
								isDot = true; //�� ���� ����� - ���������.
								isPushed = true; //���������
							}
							else
							{
								cout << "�������� ������ �������! ������ � �����";
								exit(1);
							}
						}

						if (line[i] == '(') {cout << "����� ����� ����� ������� ��� �����!\n"; exit(1);}

						if ((line[i] < '0' || line[i] > '9') && //�������� �� ��� ���������� ���������� �������
							line[i] != '.' && line[i] != '+' &&
							line[i] != '*' && line[i] != '/' &&
							line[i] != '^' && line[i] != '#' &&
							line[i] != ')')
						{
							cout << "� ����� - ����������� ������! " << line[i] << " ��������� ����\n";
							exit(1);
						}

						if((line[i] == '+' || //���� ����� ����� �����, �.�. ���� ��������
							line[i] == '*' ||
							line[i] == '/' ||
							line[i] == '^' ||
							line[i] == ')') && !isPushed)
						{
							ToPush+= line.substr(0,i);	//��������� ����� � ToPush
							of << ToPush << ' ';	//��������� ToPush � ���
							isPushed = true;			//��������� �����
							isMoved = true;				//��������� ������ ������
							line = line.substr(i, line.size()); //��������� ������ �� ����� �����
							i = line.size();	//������� �� �����
						}
						if (line[i] == '#')
						{
							line.insert(i,1,'+'); //�������� ������������� == ���������� �������������
							i--;
							isPushed = true;
						}
					
						if(i == line.size() - 1 && !isPushed ) //���� ��������� ���� � ������
						{
							ToPush += line; //���������� ��� ������ � ToPush
							of << ToPush << ' '; //��������� ToPush � ���
							isPushed = true;	//��������� ������
							isMoved = true;		//��������� ������ � ������
							line.clear();		//������� ������ �� �����
						}
					}
				}

			//�������, ���� �� ���� � �� ����� - �� ������
				if(!isMoved) {cout << "������ � �������. ��������� ��������.\n"; exit(1);}
			}while (line.size() != 0);

		//�������� ������ ������, ������ ������ ������� �� ���� � ��������� � ������.		
			do
			{
				if (stack.ShowLast() == '(') //���� ����� ������ ������ �� ����� � ����� �������� ����������� ������ - ������
				{
					cout << "������! ������� ����������� ������ ��������!";
					exit(1);
				}
				else 
					of << stack.Pop() << ' '; //����� - ��������� ��������� � �������, �������� ���������� �� ����
			}while (!stack.Is_Empty()); //�� ����������� �����

			of << '\n';
			cout<< "����������\n"; 
		}
		else
		{
			cout << "�����\n";
		}

	//------------------------------����� �-------

	cout << "\n����� �\n";
		
	vector<string> Polska;	//������ ����� � ��� - � ���� �� �������� ��������� ������
	way.clear();		//������� ��������������� ������
	line.clear();

	ifstream Bin(way.c_str()); //��������� ����
	
	do
	{
		getline(Bin, line);	//������ ������
		if (!line.empty())	//���� �� �����
		{
			stringCheck(line);	//�������� ������ ��� ������
			Polska.clear();		
			stack.clear();
			for (int i = 0; i < line.size(); i++)
			{
				if (i < line.size() - 1 && line[i] == ' ')	//���� �� ����� ����������� ������
				{
					Polska.push_back(line.substr(0,i));		//��������� ����� ��� �������� � ������
					line = line.substr(i+1, line.size());	//����������� �������� ������
					i = -1;									//��� � ������
				}
				if (i== line.size() - 1)					
				{
					if(line[i] == ' ')						//��������� ������ - ������
						Polska.push_back(line.substr(0,i));
					else									//�������� ������
						Polska.push_back(line.substr(0, line.size()));					
					line.clear();		//������ ���������
				}
			}

			//�������� � ���������� �������
			if (Polska[0] == "+" || Polska[0] == "*" ||
				Polska[0] == "/" || Polska[0] == "^" )
			{
				cout << "������ - �������� ����� � ������ ����������� �����!";
				exit(1);
			}

		
			double numup, numdown; //���� ����� � ��������� �� ��� �������
			cout << "\n� ���� (��������)" << setw(28) << "���� (base <--- top\n"; //����� 
			cout << setw(2) << "0"  << setw(8) << "(init)" << setw(20) << "����\n";
	
			for (unsigned i = 0; i < Polska.size(); i++)
				if (Polska[i] != "+" && Polska[i] != "*" &&	//���� �����
					Polska[i] != "/" && Polska[i] != "^" )
				{
					stack.Push(StrToDoub(Polska[i]));	//� ���� ���
					cout << setw(2) << i+1 << setw(8) << "(push)" << setw(20); //����� ������� �����
					stack.PrintD();	//������� ���� �� �����
				}
				else //���� ��������
				{
					numup = stack.PopD();		//����������� ������
					numdown = stack.PopD();		//������
					if(Polska[i] == "+") stack.Push(numup+numdown);	//������ �������� � ����������� �� ���������
					if(Polska[i] == "*") stack.Push(numdown*numup);
					if(Polska[i] == "/") stack.Push(numdown/numup);
					if(Polska[i] == "^") stack.Push(Pow(numdown,numup));
					cout << setw(2)<<  i+1 << setw(8) << " (pop)" << setw(20);	//����� �����
					stack.PrintD();				//����� �����
				}
				cout << "[x] ��������� ����� ������, �������� �������� " << stack.PopD() << '\n'; 
		}
	}while (!Bin.eof());
	system("pause");
	return 0;	
}


function stringCheck(str) //�������� ��������� ������ �� ��������� �������������
{	
	var line = str.callee;
	var i = 0;
	while ( i < line.size())
	{
		if (line[i] == '{' || line[i] == '[' || line[i] == '<') line[i] = '('; //�������� ������
		if (line[i] == '}' || line[i] == ']' || line[i] == '>') line[i] = ')';

		if (line[i] == ',') line[i] = '.';

		if ((line[i] < '0' || line[i] > '9') && //�������� �� ��� ���������� ���������� �������
			line[i] != '.' && line[i] != '+' &&
			line[i] != '*' && line[i] != '/' &&
			line[i] != '^' && line[i] != ')' &&
			line[i] != '-' && line[i] != '(' &&
			line[i] != ' ')
		{
			alert ("� ����� - ����������� ������! " + line[i] + " ��������� ����\n" );
		}
	}
	i = 0
	for(unsigned i = 0; i < line.size() - 1; i++)
	{
		if (line[i] == ' ' && line[i+1] == ' ')			//������� ����������� �������
			{line.erase(i,1); i = 0;}
	}
}

