    
    var html5client={};
    html5client.webdb={};
    html5client.webdb.db=null;

    html5client.webdb.open=function()
    {
        var dbsize=5 * 1024 * 1024;
        html5client.webdb.db=openDatabase("cashstoredb","1.0","cashstoredb",dbsize);
        
    };
    
    html5client.webdb.createTable=function()
    {
        var db=html5client.webdb.db;
        db.transaction(function(tx)
        {
            tx.executeSql("CREATE TABLE IF NOT EXISTS cash_tab(id integer primary key autoincrement, name varchar(255), amount integer,Tdate varchar(150),type integer)",[],function() { });    
        });
    };
    
    function init_client()
    {
        html5client.webdb.open();
        html5client.webdb.createTable();
    }
	
	function addRecords(name,amount,process,date)
	{
		var db=html5client.webdb.db;
        db.transaction(function(tx)
        {
            tx.executeSql("INSERT INTO cash_tab(name,amount,Tdate,type)values(?,?,?,?)",[name,amount,date,process],function()
                        {
                            $("#res").text("Record added successfully");
							$("#name").val("");
							$("#amount").val("");
							$("#date").val("");
							$("#process").val("0");
							wait();
                        });
        });
	}
	
	function wait()
	{
		var sec=5;
		setInterval(repeat,1000);
		function repeat()
		{
			sec--;
			if(sec<=0)
			{
				$("#res").text("");
			}
			else
			{
				setInterval(repeat,1000);
			}
		}
	}
	
    function removeDetails(cid,type)
    {
        var db=html5client.webdb.db;
        db.transaction(function(tx)
        {
            tx.executeSql("DELETE FROM cash_tab WHERE id=?",[cid],function(){
                navigator.notification.alert("Record successfully deleted.",function(){ },"Message","Ok");
                getDetails(type);
            });
        });
    }
    function  updateDetails(cid,type,amount)
    {
        var db=html5client.webdb.db;
        db.transaction(function(tx)
        {
            tx.executeSql("UPDATE cash_tab SET amount=? WHERE id=?",[amount,cid],function(){ 
                navigator.notification.alert("Record successfully updated.",function(){ },"Message","Ok");
                getDetails(type);
            });
        });
    }
    
    function loanDetails()
    {
        var gamt=0;
        var tamt=0;
        var db=html5client.webdb.db;
        db.transaction(function(tx)
        {
            tx.executeSql("SELECT amount FROM cash_tab WHERE type=?",[1],function(tx,rs)
            {
                for(var j=0;j<rs.rows.length;j++)
                {
                    gamt+=rs.rows.item(j).amount;
                }
                $("#gc").text(gamt);
            });
            
            tx.executeSql("SELECT amount FROM cash_tab WHERE type=?",[2],function(tx,rs)
            {
                for(var j=0;j<rs.rows.length;j++)
                {
                    tamt+=rs.rows.item(j).amount;
                }
                $("#tc").text(tamt);
                
                var tln=gamt-tamt;
                if(tln<0)
                {
                    $(".tla").css("color","#FF6945");
                }
                else if(tln>0)
                {
                    $(".tla").css("color","#00CC35");
                }
                $("#tlam").text(tln);
            });
            
           
            
        });
    }
	function getDetails(typeval)
	{
       
		$("#myTab tbody tr").remove();
        var db=html5client.webdb.db;
        db.transaction(function(tx)
        {
            tx.executeSql("SELECT id,name,amount,Tdate,type FROM cash_tab WHERE type=?",[typeval],function(tx,rs)
          {
                for(var i=0;i<rs.rows.length;i++)
                {
                    var row="<tr><td class='nm' style='cursor:pointer;'><input type='hidden' value='"+rs.rows.item(i).id+"'/>"+rs.rows.item(i).name+"</td><td class='am'><input type='hidden' value='"+rs.rows.item(i).id+"'/><input class='amt' type='text' value='"+rs.rows.item(i).amount+"'/></td><td>"+rs.rows.item(i).Tdate+"</td><td class='red'><input type='hidden' value='"+rs.rows.item(i).id+"'/>X</td></tr>";
                    
                   $("#myTab tbody").append(row);
                }
          });
            
        });
	}