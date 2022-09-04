const todoInput = document.querySelector("#todo");                                                                      // eklenmek isteyen todonun yazıldığı input inputa girilen todoyu eklemeye yarayan buton
const addTodoBtn = document.querySelector("#addTodoBtn"); 
const ul = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const clearAllTodosBtn = document.querySelector("#clearAllTodosBtn");
const searchTodoInput = document.querySelector("#searchTodoInput");



addTodoBtn.addEventListener("click",whenClick);                                                                         // todo ekleme butonuna basıldığında "click" eventi gerçekleştirmesi ve gerçekleştiğindeki  fonksiyonun tanımlanması                
document.addEventListener("DOMContentLoaded",addtodoToUIFromStorage);                                                   // yazdığımız todoları local storage a kaydettikten sonra  keydedilenleri UI da göstermemize yarayan eventi yazdık                                                                              
ul.addEventListener("click",deleteTodofromUI);
clearAllTodosBtn.addEventListener("click",clearAllTodos)
searchTodoInput.addEventListener("keyup",filterTodo);                                                                   // keyup eventi olduğunda filterTodo fonksiyonun çalışmasını söyledik

function filterTodo(e){ 
    const listItems = document.querySelectorAll(".list-group-item");
    const filter = e.target.value.toLowerCase();
    
    listItems.forEach(function(listItem){
        const text = listItem.textContent.toLowerCase();
        if(text.indexOf(filter) === -1){
            listItem.setAttribute("style","display: none !important");
        }
        else{
            listItem.setAttribute("style","display: block");
        }
    })
}

function clearAllTodos(e){
    ul.remove();
    localStorage.clear();
    showAlert("success","Tüm Todolar Silindi");
    setTimeout(function(){
        window.location.reload(false)
    },2000)
}

function deleteTodofromUI(e){
    if(e.target.className === "fa fa-remove"){
        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
    }
}

function deleteTodoFromStorage(deletetodo){
    let todos = getTodosFromStorage();
    todos.forEach(function(todo,index){
        if(todo === deletetodo){
            todos.splice(index,1);
        }
    })
    localStorage.setItem("todos",JSON.stringify(todos));
}


function whenClick(e){                                                                                                  // Click eventi gerçekleştiğinde gerçekleşecek olan fonksiyon
    let newTodo = todoInput.value;                                                                                      // todonun yazıldığı inputtaki veriyi todo adındaki değişkene atadık
    if(todoInput.value === ""){
        showAlert("danger","Herhangi bir Todo Girin")
    }
    else{
        addTodoToUI(newTodo)                                                                                            // UI a todoyu eklemek için yazdığımız fonksiyonu çağırdık
        addTodosToStorage(newTodo);                                                                                     // Todoyu UI a eklemek için yazdığımız fonskiyonu çalıştırdık
        showAlert("success","Todo Başarıyla Kaydedildi");
    }
        e.preventDefault();                                                                                             // event her gerçekleştiğinde sayfa yenilenmesin diye yazdığımız kod
    }

function addTodoToUI(newTodo){                                                                                          //  Todoyu UI a eklemek için yazdığımız fonskiyon

/*                                                                                           
<li class="list-group-item d-flex justify-content-between">                                                             // todoları UI ya eklemek için yapıcağımız elementler.
    Todo 1
    <a href=""><i class="fa fa-remove"></i></a> 
</li>
*/

    const li = document.createElement("li");                                                                            // UI eklerken kullanıcağımız li etiketi oluşturuldu
    const a = document.createElement("a");                                                                              // UI eklerken kullanıcağımız li etiketi oluşturuldu

    li.className = "list-group-item d-flex justify-content-between";                                                    // li elementine classname verdik;
    li.appendChild(document.createTextNode(newTodo));                                                                   // todoyu yazdırdık
    a.href = "#";                                                                                                       // a elementine href ekledik
    a.innerHTML = '<i class="fa fa-remove"></i>'                                                                        // a elementine html kodu ile iconu ekledik
    li.appendChild(a);                                                                                                  // li etiketinin için hazırlamış olduğumuz a etiketini yerleştirdik
    ul.appendChild(li);                                                                                                 // ul etiketinin için hazırlamış olduğumuz li etiketini yerleştirdik
    todoInput.value = ""                                                                                                // todo eklendikten sonra ınputun value değerinin boş olmasını istedik
}

function showAlert(type,massage){                                                                                       // yeni todo eklendiğinde, silindiğinde veya hata ile karşılaşıldığında kullanıcıya uyarı verilmesi için gerekli fonksiyon oluşturuldu
/*                                                                                                                      // uyarının verileceği örnek html kodları buna bakarak elementleri oluşturdum 
<div class="alert alert-danger" role="alert">
  A simple danger alert—check it out!
</div>
*/
const div = document.createElement("div");
div.className = `alert alert-${type} mt-3`
div.textContent = massage;
firstCardBody.appendChild(div);
setTimeout(function() {
    div.remove();
  }, 2000);
}

function getTodosFromStorage(){                                                                                         // Local storage da todos adında array kaydı varmı yokmu sorguladığımız bir fonksiyon yazdık. Bu sorguyu yapan ve todoyu storage a ekleyen fonksiyonları ayrı ayrı yazdık çünkü bu fonksiyonu eklemek dışında mesela silme işlemi gibi başka fonksiyonlarda da kullanıcaz
    let todos;                                                                                                          // tüm todolarımız todos adında ki değişkende saklanıcak

    if(localStorage.getItem("todos") === null){                                                                         // storage da todos adında bir array kayıtlımı diye sorguladığımız if koşulu
        todos = [];                                                                                                     // eğer yoksa todos adında boş array oluşturur
    }
    else{                                                                                                               // eğer varsa oluşturduğumuz todos adındaki değişkene storage da ki veriyi eşitler
        todos = JSON.parse(localStorage.getItem("todos"));
    }

    return todos;                                                                                                       // fonksiyon todos adında ki değişkeni döner
}

function addTodosToStorage(newTodo){                                                                                    // yazdığımız todoları 
    let todos = getTodosFromStorage()
    todos.push(newTodo);
    localStorage.setItem("todos",JSON.stringify(todos));
}

function addtodoToUIFromStorage(){                                                                                      // yazdığımız todoları local storage a kaydettikten sonra keydedilenleri UI da göstermemize yarayan eventin çalışınca olacakları yazdığımız fonksiyon 
    let todos = getTodosFromStorage();                                                                                  // storage da todos adındaki verileri todos adlı değişkene eşitledik
    todos.forEach(function(todo){                                                                                       // todos arrayininin elemanlarını teker teker dönmesi için forEach döngüsü oluşturduk. döndüğü her elemena todo adını verdik
        addTodoToUI(todo);                                                                                              // her döndüğünde gelen elemanı todolarımı UI a eklediğimiz fonksiyon ile UI a ekledik
    })
}








