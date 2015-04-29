angular.module("observerApp").controller("indexController",["$scope", function ($scope){

	//Model for the available controls - Starts Here

    $scope.ctrlModel = { 
		checkbox1: true, 
		checkbox2: false, 
		textbox: "This is a test", 
		radio: "radio3", 
		selectsingle: "1", 
		selectmultiple: "" 
	};
	
	$scope.groupModel = { 
		radio: "radio2", 
		checkbox: false, 
		textbox: "Group Value" 
	};
	
	//Model for the available controls - Ends Here

	//Target data to modify when change occurs - Starts Here
	
    $scope.target = { 
		checkbox: "Edit value", 
		textbox: "Edit value", 
		radiobutton: "Edit value", 
		selectsingle: "Edit value", 
		selectmultiple: "Edit value" 
	};

	$scope.groupTarget = "Edit value";    
    
	//Target data to modify when change occurs - Ends Here

    $scope.checkOptions = { 
		defaultValue: true, 
		onTrackerChange: function (isModify) { 
			$scope.target.checkbox = isModify ? "Edited" : "Edit value"; 
		}
	};

    $scope.textOptions = { 
		defaultValue: "This is a test", 
		eventType: 'keyup', 
		onTrackerChange: function (isModify) { 
			$scope.target.textbox = isModify ? "Edited" : "Edit value"; 
		}
	};

    $scope.radioOptions = { 
		defaultValue: "radio3", 
		onTrackerChange: function (isModify) { 
			$scope.target.radiobutton = isModify ? "Edited" : "Edit value"; 
		}
	};

    $scope.selectOptions = { 
		defaultValue: "1", 
		onTrackerChange: function (isModify) { 
			$scope.target.selectsingle = isModify ? "Edited" : "Edit value"; 
		} 
	};

    $scope.selectMulOptions = { 
		defaultValue: ["1"], 
		onTrackerChange: function (isModify) { 
			$scope.target.selectmultiple = isModify ? "Edited" : "Edit value"; 
		} 
	};

    $scope.commonOptions = { 
		defaultValue: { 
			textType: "Group Value", 
			radioTypeGroup: "radio2", 
			checkType: false 
		}, 
		eventType: 'change', 
		onTrackerChange: function (isModify) { 
			$scope.groupTarget = isModify ? "Edited" : "Edit value"; 
		}, 
		isGroup: true 
	};

}]);