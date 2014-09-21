#include "stdafx.h"
#include <string>
#include <fstream>
#include <iostream>
#include <iomanip>
#include <vector>
#include "math.h"

using namespace std;

double StrToDoub(string);	//��������� �� ������ � ������������ �����
double Pow(double, double);	//���������� � �������,  ����� �������, ��� pow
void stringCheck(string&);	//����������� ������ ������ �� �����

class My_Stack {
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
	setlocale(LC_ALL, "Russian");

	string line, way, wayout;		//��� ��������������� ������
	bool isGood = false;	//�������� ������
	do
	{
		cout << "������� ���� � ������ ��� ����� ��� �����: ";
		cin >> way;
		
		for(unsigned i = 0; i < way.size() - 1; i++)
		{
			if (way[i] == '\\')			//�������� ����� �� ������� ��� ����������� �����������.
				if(way[i+1] != '\\' && way[i-1] != '\\') //������������ ����������� ������� ������� �����.
					way.insert(i, "\\");
		}
		
		//cout << way << '\n';
		
		isGood = true;
		ifstream in (way.c_str()); //������� ������� �����
		if (!in.good())
		{
			isGood = false;
			cout << "������� ����� ����� �����. ��������� ����!\n";
			in.close();
		}
	}while (!isGood);

	//���� ��� ������.
	do
	{
		cout << "������� ���� � ������ ��� ����� ��� ������: ";
		cin >> wayout;
		for(unsigned i = 0; i < wayout.size() - 1; i++)
		{
			if (wayout[i] == '\\' &&
				wayout[i+1] != '\\' &&	//�������� ����� �� ������� ��� ����������� �����������.
				wayout[i-1] != '\\') //������������ ����������� ������� ������� �����.
					wayout.insert(i, "\\");
		}
		isGood = true;
		ofstream of (wayout.c_str()); //������� ������� �����
		if (!of.good())
		{
			isGood = false;
			cout << "������� ����� ����� �����. ��������� ����!\n";
			of.close();
		}
	}while (!isGood);

	ifstream in (way.c_str()); //������� � ������������
	ofstream of (wayout.c_str());

	My_Stack stack; //��������� ���� ��� �������� ������

	bool isMoved = true;
	int NumStr = 0;
	do
	{
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
	}while (!in.eof());	//�� ��������� �����
	
	in.close(); //��������� �����
	of.close();

	//------------------------------����� �-------

	cout << "\n����� �\n";
		
	vector<string> Polska;	//������ ����� � ��� - � ���� �� �������� ��������� ������
	way.clear();		//������� ��������������� ������
	line.clear();
	
	do
	{
		cout << "������� ���� � ������ ��� ����� ��� �����: ";
		cin >> way;
		for(unsigned i = 1; i < way.size() - 1; i++)
		{
			if (way[i] == '\\')			//�������� ����� �� ������� ��� ����������� �����������.
				if(way[i+1] != '\\' && way[i-1] != '\\') //������������ ����������� ������� ������� �����.
					way.insert(i, "\\");
		}
		//cout << way << '\n';
		isGood = true;
		ifstream in (way.c_str()); //������� ������� �����
		if (!in.good())
		{
			isGood = false;
			cout << "������� ����� ����� �����. ��������� ����!\n";
			in.close();
		}
	}while (!isGood);

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

My_Stack::My_Stack()
{
	//cout << "����� ctor-a\n"; //���������� �����. Must have.
}

char My_Stack::Pop()
{		
	char c = home.back();	//���� ��������� ������� �������
	home.pop_back();		//������� ��� �� �������
	return c;				//� ���������� ������������
}

double My_Stack::PopD() //����������� ���.�����
{
	double res = dome.back();	//�����������
	dome.pop_back();			//������� �� �������
	return res;					//���������� ���������
}

void My_Stack::Push(char c)
{
	this->home.push_back(c);//��������� �������� � ����
}

void My_Stack::Push(double d)
{
	this->dome.push_back(d);//��������� ����� � ����
}

bool My_Stack::Is_Empty() const
{
	if (this->home.size() == 0) return true;//���� ���� ����
	return false;							//�����
}

bool My_Stack::Is_DEmpty() const
{
	if (this->dome.size() == 0) return true;//���� ���� ����
	return false;							//�����
}

void My_Stack::clear()
{
	this->home.clear();	//������� ����
	this->dome.clear();
}

char My_Stack::ShowLast() const
{
	return this->home.back(); //���������� ��������� �������, �� ������ ���
}

void My_Stack::PrintD() const //����� �����
{
	cout.precision(5);
	if(this->Is_DEmpty()) {cout << setw(20) << "����\n";} //���� ���� ����
	else
	{
		cout << setw(20) << this->dome[0];			//����� � �������� ������� ��������
		for (unsigned i = 1; i < this->dome.size(); i++)	//���� - ����� ���������
			cout << setw(7) << this->dome[i];
		cout << '\n';
	}
}

double StrToDoub(string line)		//�� ������ - � ���.�����
{
	bool isSignMinus = false;		//������������� ��?
	if(line[0] == '-') {isSignMinus = true; line = line.substr(1, line.size());}

	double result = 0;
	int dot = -1; //���� �����

	for (unsigned i = 0; i < line.size(); i++)
		if (line[i] == '.') {dot = i; i = line.size();}	//���� ����� ����, �� dot >0
	
	double por = 1;//������� �������

	if (dot < 0) //���� ����� ���
		for (int i = line.size() - 1; i > -1; i--)
		{
			result += (line[i] - '0')*por; //������� ���� � �����, ��������� ���������
			por *=10;
		}
	else		//���� ����� - ��������� ����� � ������� �����
	{
		por = 1; 
		for (int i = dot - 1; i > -1; i--) //����� �����
		{
			result += (line[i] - '0')*por;
			por *=10;
		}

		por = 1;
		for (int i = dot+1; i < line.size(); i++) //������� �����
		{
			por *=0.1;
			result += (line[i] - '0')*por;
		}
	}
	if (isSignMinus) //���� ����� �������������
		result = 0 - result;	//������ ��� �������������
	return result;
}

double Pow(double x, double y) //����� ������� �������� Pow
{
	if( x > 0) return pow(x,y); //���� ��������� > 0 - ��� ������
	if (x == 0) return 0.;		//���� ��������� == 0, ���������� 0
	if (x < 0)					//���� ������ 0
	{
		int inty = (int)(y);	
		if (inty %2 == 0 && y - inty == 0) return pow(x*(-1),y); //���� ���������� - ������ - ������� �����
		else return (-1)*pow(x*(-1),y);				//����� ������� ����� �� ���� �������
	} 
	cout << "�� ������� �������� Pow. ����� �� ���������.\n"; //�� ���������� �����
	return 0;
}

void stringCheck(string &line) //�������� ��������� ������ �� ��������� �������������
{	
	for (unsigned i = 0; i < line.size(); i++)
	{
		if (line[i] == '{' || line[i] == '[' || line[i] == '<') line[i] = '('; //�������� ������
		if (line[i] == '}' || line[i] == ']' || line[i] == '>') line[i] = ')';

		if (line[i] == ',') line[i] = '.';

		if (line[i] == '#')					//��������� �� ������ #, �������� ���� �� ��������� �� ������;
		{									//�� ������������ ��� ������ ������������� ��������� ���������
			cout << "������ � �������! ������ ���� #\n";
			cout << "���������? Y/N: ";
			string rest;
			cin >> rest;
			if (rest[0] == 'Y' || rest[0] == 'y')
			{for (unsigned j = 0; j < line.size(); j++)
					if(line[j] == '#')
						line.replace(j,1,1,' ');
			}
			else 
			{ cout << "����� �� ���������.\n"; exit(1);}
		}

		if ((line[i] < '0' || line[i] > '9') && //�������� �� ��� ���������� ���������� �������
			line[i] != '.' && line[i] != '+' &&
			line[i] != '*' && line[i] != '/' &&
			line[i] != '^' && line[i] != ')' &&
			line[i] != '-' && line[i] != '(' &&
			line[i] != ' ')
		{
			cout << "� ����� - ����������� ������! " << line[i] << " ��������� ����\n";
			exit(1);
		}
	}

	for(unsigned i = 0; i < line.size() - 1; i++)
	{
		if (line[i] == ' ' && line[i+1] == ' ')			//������� ����������� �������
			{line.erase(i,1); i = 0;}
	}
}