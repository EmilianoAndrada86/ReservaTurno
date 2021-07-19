//Clases Paciente y Turno
class paciente{
    constructor(nombre,apellido,dni){
        this.nombre=nombre;
        this.apellido=apellido;
        this.dni=dni;
    }
    listaTurnos = [];
}
class turno{
    constructor(id, servicio, sede, fecha,horarios){
        this.id=id;
        this.servicio=servicio;
        this.sede=sede;
        this.horarios=horarios;
        this.fecha=fecha;
    }
}
//Lista pacientes que usamos para saber quien reservo turno.
const listaPacientes = [];

$(document).ready(()=>{

    const turno1= new turno(1,"Laboratorio","Villa Urquiza","20/06/2021","9:00");
    const turno2= new turno(2,"Laboratorio","Villa Urquiza","20/06/2021","10:00");
    const turno3= new turno(3,"Vacunas","Villa Urquiza","20/06/2021","9:00");
    const turno4= new turno(4,"Vacunas","Villa Urquiza","20/06/2021","10:00");
    const turno5= new turno(5,"Servicio Medico","Villa Urquiza","20/06/2021","9:00");
    const turno6= new turno(6,"Servicio Medico","Villa Urquiza","20/06/2021","10:00");
    //turnos Belgrano
    const turno7 = new turno(7,"Laboratorio","Belgrano","20/06/2021","9:00");
    const turno8 = new turno(8,"Laboratorio","Belgrano","20/06/2021","10:00");
    const turno9 = new turno(9,"Vacunas","Belgrano","20/06/2021","9:00");
    const turno10 = new turno(10,"Vacunas","Belgrano","20/06/2021","10:00");
    //turnos flores
    const turno11=new turno(11,"Laboratorio","Flores","20/06/2021","9:00");
    const turno12=new turno(12,"Laboratorio","Flores","20/06/2021","10:00");
    const turno13=new turno(13,"Servicio Medico","Flores","20/06/2021","9:00");
    const turno14=new turno(14,"Servicio Medico","Flores","20/06/2021","10:00");
    //Cargar Turnos en el localStorage
    const arrayTurnos = [turno1,turno2,turno3,turno4,turno5,turno6,turno7,turno8,turno9,turno10,turno11,turno12,turno13,turno14];
    for (const turno of arrayTurnos) {
        localStorage.setItem(turno.id,JSON.stringify(turno));
    }



})

//Genero turnos que se guardan en el json con el boton generar turnos

function crearTabla(tabla){

    let servicio;
    if(document.getElementById("gridRadios1").checked){
        servicio=document.getElementById("gridRadios1").value;
    }else if(document.getElementById("gridRadios2").checked){
        servicio=document.getElementById("gridRadios2").value;
    }else{
        servicio=document.getElementById("gridRadios3").value;
    }
    let sede;
    if(document.getElementById("Radios1").checked){
        sede=document.getElementById("Radios1").value;
    }else if(document.getElementById("Radios2").checked){
        sede=document.getElementById("Radios2").value;
    }else{
        sede=document.getElementById("Radios3").value;
    }

    if(tabla.hasChildNodes()){
        while(tabla.hasChildNodes()>=1){
            tabla.removeChild(tabla.firstChild);
        }
    }
    $("#tableTurnos").append("<th scope=\"col\">Servicio</th><th scope=\"col\">Sede</th><th scope=\"col\">Dia Disponible</th><th scope=\"col\">Horario</th></thead><th scope=\"col\">Seleccione Turno</th>")
    $("#tableTurnos").append(`<tbody id="bodyTabla"></tbody>`)
    let bodyTabla = document.getElementById("bodyTabla")
    let contador = 1;
    for(let i=1;i<=localStorage.length;i++){
        const turno = JSON.parse(localStorage.getItem(i.toString()));
        if(turno != null && turno.sede == sede && turno.servicio == servicio){
        let filaTurno = document.createElement("tr");
        filaTurno.innerHTML= " <tr><th scope=\"row\">"+turno.servicio+"</th><td>"+turno.sede+"</td><td>"+turno.fecha+"</td><td>"+turno.horarios+"</td><td><input class=\"form-check-input\" type=\"radio\" name=\"turno\" id="+contador+" value="+turno.id+" checked></input></td></tr>";
        bodyTabla.appendChild(filaTurno);
        contador++;
        
        }
    }
}

//Genero Tabla Turnos
    $("#tabla").append(`<table class="table" id="tableTurnos"></table>`);
    let table = document.getElementById("tableTurnos");
//funcion del boton Turnos disponibles.
$("#turnos").click(function(){
    crearTabla(table);
    //creo el boton Reservar Turno
    let divBoton = document.getElementById("sTurno");
    if(divBoton.hasChildNodes()){
        while(divBoton.hasChildNodes()>=1){
            divBoton.removeChild(divBoton.firstChild);
        }
    }
    $("#sTurno").append(`<button type="submit" class="btn btn-primary" id="selTurno">Reservar Turno</button>`)  
    //ASigno funcion al click de reservar turno
    $("#selTurno").click(function(){
        nuevoPaciente = new paciente(document.getElementById("nombre").value,document.getElementById("apellido").value,document.getElementById("dni").value);
        let aux = bodyTabla.childElementCount;
        for(let i = 1; i<=aux;i++){
            let aux2=document.getElementById(i.toString())
            if(aux2.checked){
                let cardinal = listaPacientes.findIndex(x=>x.dni==nuevoPaciente.dni);
                if(cardinal > -1){
                  listaPacientes[listaPacientes.findIndex(x=> x.dni==nuevoPaciente.dni)].listaTurnos.push(JSON.parse(localStorage.getItem(aux2.value)));
                  localStorage.removeItem(aux2.value);
                } 
                else{ 
                nuevoPaciente.listaTurnos.push(JSON.parse(localStorage.getItem(aux2.value)));
                listaPacientes.push(nuevoPaciente);
                localStorage.removeItem(aux2.value);}
            }
        }
        $.post("https://jsonplaceholder.typicode.com/posts",function(datos,status){
                if(status="success"){
                    Swal.fire('Exito',nuevoPaciente.nombre +' El turno ha sido reservado correctamente','success');
                    crearTabla(table);
                    return false;
                }


        })
      

    }
    )
    $("#tabla").slideUp(1);
    $("#tabla").slideDown(2000);
    return false;

})
$("#turnosReservados").click(function(){
    if(table.hasChildNodes()){
        while(table.hasChildNodes()>=1){
            table.removeChild(table.firstChild);
        }
    }

    let divBoton = document.getElementById("sTurno");
    if(divBoton.hasChildNodes()){
        while(divBoton.hasChildNodes()>=1){
            divBoton.removeChild(divBoton.firstChild);
        }
    }
    
    $("#tableTurnos").append("<thead><th scope=\"col\">Nombre</th><th scope=\"col\">Apellido</th><th scope=\"col\">DNI</th><th scope=\"col\">Sede</th><th scope=\"col\">Servicio</th><th scope=\"col\">Fecha y Hora</th></thead>")
    $("#tableTurnos").append(`<tbody id="bodyReserva"></tbody>`)
    let i = 1;
    for (const paciente of listaPacientes) {
        
        $("#bodyReserva").append("<tr><th scope=\"row\">"+paciente.nombre+"</th><td>"+paciente.apellido+"</td><td>"+paciente.dni+"</td><td id="+i.toString()+"></td><td id="+(i+1).toString()+"></td><td id="+(i+2).toString()+"></td></tr>");
        
            for (const turno of paciente.listaTurnos) {
                let aux1=document.getElementById(i.toString());
                let aux2=document.getElementById((i+1).toString());
                let aux3=document.getElementById((i+2).toString());

                aux1.innerHTML= aux1.innerHTML+turno.sede+"<br>";
                aux2.innerHTML= aux2.innerHTML+turno.servicio+"<br>";
                aux3.innerHTML=aux3.innerHTML+turno.fecha+" "+turno.horarios+"<br>";

            }
            i=i+3;
    }

    $("#tabla").slideUp(1);
    $("#tabla").slideDown(2000);
    return false;

})










