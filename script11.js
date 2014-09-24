<p><input type="text" id="code" autocapitalize="off" spellcheck="false" value="2+2" onchange="" onkeydown="">
    <button onclick="go()">Построить</button></p>

	
var My_Stack {
public:
	My_Stack();				// конструктор по умолчанию.
	void clear();			//очистка массива
	void PrintD() const;
	void Push(char);		//добавление элемента в стек
	void Push(double);
	char Pop();				//удаление элемента из стека
	double PopD();
	char ShowLast() const;	//демонстрация последнего элемента Пользователю без удаления из стека
	bool Is_Empty() const;	//проверка стека на пустоту
	bool Is_DEmpty() const;
private:
	vector <char> home;		// "хранилище" операторов в стеке
	vector <double> dome;	//"хранилище" чисел
};

int _tmain(int argc, _TCHAR* argv[])
{

	var line;
	var way;
	var wayout;		//три вспомогательных строки

	My_Stack stack; //временный стек для хранения знаков

	var isMoved = true;
	var NumStr = 0;
	
		getline(in,line); //считываем строку
		NumStr++;
		cout << "Строка " << NumStr << ": ";

		if (!line.empty())
		{
			stringCheck(line);

			for(int i = 0; i < line.size(); i++)
				if (line[i] == ' ')			//убираем все пробелы
					{line.erase(i,1); i--;}

			for(unsigned i = 0; i < line.size() - 2; i++)
				if ( (line[i] == '+' || line[i] == '*' || //если повтор знака оператора
					line[i] == '/' || line[i] == '^' || line[i] == '-') 
					&& line[i+1] == line[i])
				{
					cout << "Ошибка! Два оператора подряд без числа между ними!\nНеверный оператор - " << line[i] << '\n';
					exit(1);
				}
			
			for(unsigned i = 0; i < line.size(); i++)
				if (line[i] == '-')			//заменяем минусы на #- для отображения отрцательных чисел
				{
					line.insert(i,"#");
					i++;
				}

			for(unsigned i = 0; i < line.size() - 1; i++)
				if(line[i+1] == '#' && line[i] == ')') 	//если решётка стоит сразу после закрывающей скобки - не хватает знака
				{
					line.insert(i+1,"+");
					i++;
				}

			do
			{
				isMoved = false; //не сделали изменений с нулевым символом строки
				if(line[0] == '(')
				{
					stack.Push(line[0]);	//добавляем в стек
					line = line.substr(1, line.size());	//уменьшаем строку на этот символ
					isMoved = true;	//совершили операцию
				}
			
				if(line[0] == ')' && !isMoved)
				{
					if (stack.Is_Empty())	//если стек пуст - ошибка
					{
						cout << "Ошибка! Формула не сбалансирована скобками!\nВыход из программы..";
						exit(1);
					}
					else
						if(stack.ShowLast() == '(') //если последняя операция - левая скобка
					{
							line = line.substr(1, line.size()); //удаляем из строки
							stack.Pop();						//и удаляем из стека
							isMoved = true;
					}
					else if (stack.ShowLast() == '+' || //если там один из знаков
						stack.ShowLast() == '*' ||
						stack.ShowLast() == '/' ||
						stack.ShowLast() == '^')
						{
							of << stack.Pop() << ' '; //добавляем знак в Польску в файл.
							isMoved = true;
						}
				}
				if(line[0] == '^' && !isMoved) //если операция и НЕ произведено изменений
				{
					stack.Push(line[0]);	//добавляем
					line = line.substr(1, line.size()); //укорачиваем строку.
					isMoved = true;		//сделали изменение
				}	

				if(line[0] == '*' && !isMoved) //если операция и НЕ произведено изменений
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
					if (stack.ShowLast() == '*' || stack.ShowLast() == '/') //если операции этого же порядка
					{
						of << stack.Pop() << ' '; //добавляем операцию из стека в ОПН
						isMoved = true;
					} 
				}

				if(line[0] == '/' && !isMoved) //аналогично
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

				if(line[0] == '+' && !isMoved) //следующее - плюс
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
								of << stack.Pop() << ' '; //добавляем знак в Польску в файл.
								isMoved = true;
					} 
				}
			
			//проверили все операции и скобки. теперь если число:
				if((line[0] >='0' && line[0] <= '9' || line[0] == '#') && !isMoved)
				{
					bool isDot = false, //нашли ли мы точку в числе (для вещественных чисел)
					isPushed = true;//проверили цифру
					string ToPush = "";//заготовка строки для добавления в ОПН

					if (line.size() > 3 && line[0] == '#' && line[2] == '(')
						line.insert(2,"1*"); //домножаем скобку на минус один;

					if (line[0] == '#') 
					{
						ToPush = "-";
						line = line.substr(2, line.size());	//убираем искусственный знак #,
					}	//убираем от числа минус, работаем с ним как с положительным, а также добавлям минус к ToPush

					for (int i = 0; i < line.size(); i++)
					{
						isPushed = false; //пока не проверили цифру

						if(line[i] == '.' && i != 0) //точка не на первом месте
						{
							if(!isDot) 
							{
								isDot = true; //не было точки - появилась.
								isPushed = true; //проверили
							}
							else
							{
								cout << "Неверная запись формулы! Ошибка в числе";
								exit(1);
							}
						}

						if (line[i] == '(') {cout << "Число стоит перед скобкой без знака!\n"; exit(1);}

						if ((line[i] < '0' || line[i] > '9') && //проверка на все оставшиеся допустимые символы
							line[i] != '.' && line[i] != '+' &&
							line[i] != '*' && line[i] != '/' &&
							line[i] != '^' && line[i] != '#' &&
							line[i] != ')')
						{
							cout << "В числе - посторонний символ! " << line[i] << " Проверьте файл\n";
							exit(1);
						}

						if((line[i] == '+' || //если нашли конец числа, т.е. знак операции
							line[i] == '*' ||
							line[i] == '/' ||
							line[i] == '^' ||
							line[i] == ')') && !isPushed)
						{
							ToPush+= line.substr(0,i);	//добавляем число к ToPush
							of << ToPush << ' ';	//добавляем ToPush к ОПН
							isPushed = true;			//проверили цифру
							isMoved = true;				//проверили символ строки
							line = line.substr(i, line.size()); //сокращаем строку на длину числа
							i = line.size();	//выходим из цикла
						}
						if (line[i] == '#')
						{
							line.insert(i,1,'+'); //вычитаем положительное == прибавляем отрицательное
							i--;
							isPushed = true;
						}
					
						if(i == line.size() - 1 && !isPushed ) //если последний знак в строке
						{
							ToPush += line; //прибавляем всю строку к ToPush
							of << ToPush << ' '; //добавляем ToPush в ОПН
							isPushed = true;	//проверили символ
							isMoved = true;		//проверили символ в строке
							line.clear();		//очищаем строку из файла
						}
					}
				}

			//наконец, если не знак и не число - то ошибка
				if(!isMoved) {cout << "Ошибка в формуле. Проверьте значения.\n"; exit(1);}
			}while (line.size() != 0);

		//осталась пустая строка, теперь просто смотрим на стек и добавляем к строке.		
			do
			{
				if (stack.ShowLast() == '(') //если после пустой строки на входе в стеке осталась открывающая скобка - ошибка
				{
					cout << "Ошибка! Формула некорректно задана скобками!";
					exit(1);
				}
				else 
					of << stack.Pop() << ' '; //иначе - добавляем операторы в порядке, обратном добавлению на стек
			}while (!stack.Is_Empty()); //до опустошения стека

			of << '\n';
			cout<< "Обработано\n"; 
		}
		else
		{
			cout << "Пуста\n";
		}

	//------------------------------Часть В-------

	cout << "\nЧАСТЬ В\n";
		
	vector<string> Polska;	//вектор строк с ОПН - в него мы разделим считанную строку
	way.clear();		//очищаем вспомогательные строки
	line.clear();

	ifstream Bin(way.c_str()); //открываем файл
	
	do
	{
		getline(Bin, line);	//читаем строку
		if (!line.empty())	//если не пуста
		{
			stringCheck(line);	//изменяем строку под формат
			Polska.clear();		
			stack.clear();
			for (int i = 0; i < line.size(); i++)
			{
				if (i < line.size() - 1 && line[i] == ' ')	//если мы нашли разделяющий пробел
				{
					Polska.push_back(line.substr(0,i));		//добавляем число или оператор в вектор
					line = line.substr(i+1, line.size());	//укорачиваем исходную строку
					i = -1;									//идём с начала
				}
				if (i== line.size() - 1)					
				{
					if(line[i] == ' ')						//последний символ - пробел
						Polska.push_back(line.substr(0,i));
					else									//значимый символ
						Polska.push_back(line.substr(0, line.size()));					
					line.clear();		//строка кончилась
				}
			}

			//работаем с разделённой строкой
			if (Polska[0] == "+" || Polska[0] == "*" ||
				Polska[0] == "/" || Polska[0] == "^" )
			{
				cout << "Ошибка - оператор стоит в начале постфиксной формы!";
				exit(1);
			}

		
			double numup, numdown; //верх стека и следующий за ним элемент
			cout << "\n№ шага (операции)" << setw(28) << "стек (base <--- top\n"; //шапка 
			cout << setw(2) << "0"  << setw(8) << "(init)" << setw(20) << "пуст\n";
	
			for (unsigned i = 0; i < Polska.size(); i++)
				if (Polska[i] != "+" && Polska[i] != "*" &&	//если число
					Polska[i] != "/" && Polska[i] != "^" )
				{
					stack.Push(StrToDoub(Polska[i]));	//в стек его
					cout << setw(2) << i+1 << setw(8) << "(push)" << setw(20); //пишем базовую форму
					stack.PrintD();	//выводим стек на экран
				}
				else //если оператор
				{
					numup = stack.PopD();		//вытаскиваем первое
					numdown = stack.PopD();		//второе
					if(Polska[i] == "+") stack.Push(numup+numdown);	//делаем действие в зависимости от оператора
					if(Polska[i] == "*") stack.Push(numdown*numup);
					if(Polska[i] == "/") stack.Push(numdown/numup);
					if(Polska[i] == "^") stack.Push(Pow(numdown,numup));
					cout << setw(2)<<  i+1 << setw(8) << " (pop)" << setw(20);	//вывод формы
					stack.PrintD();				//вывод стека
				}
				cout << "[x] Достигнут конец строки, конечное значение " << stack.PopD() << '\n'; 
		}
	}while (!Bin.eof());
	system("pause");
	return 0;	
}


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
			line[i] != '.' && line[i] != '+' &&
			line[i] != '*' && line[i] != '/' &&
			line[i] != '^' && line[i] != ')' &&
			line[i] != '-' && line[i] != '(' &&
			line[i] != ' ')
		{
			alert ("В числе - посторонний символ! " + line[i] + " Проверьте файл\n" );
		}
	}
	i = 0
	for(unsigned i = 0; i < line.size() - 1; i++)
	{
		if (line[i] == ' ' && line[i+1] == ' ')			//убираем дублирующие пробелы
			{line.erase(i,1); i = 0;}
	}
}

