$(document).ready(async function () {
    let url = '/api/admin';
    let response = await fetch(url);
    let data = await response.json();

    let users = data.users;
    let roles = data.allRoles;
    let currentUser = data.currentUser;


    await createTableUser();

    if (currentUser != null && currentUser.roles.find(r => r.name === "ROLE_ADMIN") != null) {
        createTableBody(users);
        createRolesInput();
        createNavbar(currentUser);
        $('#table-body').on("click", '.edit-button', async function (event) {
            event.preventDefault();
            let id = $(this).data('id');

            await fillUser(id);

            $('#user-profile .modal-header h3').text('Edit User');
            $('#user-profile #password-div').show();
            $("#user-profile #editFirstName").prop("readonly", false);
            $("#user-profile #editLastName").prop("readonly", false);
            $("#user-profile #editAge").prop("readonly", false);
            $("#user-profile #editEmail").prop("readonly", false);
            $("#user-profile #editRoles").prop("disabled", false);
            let submit = $('#user-profile .modal-footer .submit-button');
            submit.text('Save');
            submit.addClass('btn-primary');
            $('#user-profile #method').val("put");

            $('#user-profile').modal("show");
        });

        $('#table-body').on("click", '.delete-button', async function (event) {
            event.preventDefault();
            let id = $(this).data('id');

            await fillUser(id);

            $('#user-profile .modal-header h3').text('Delete User');
            $('#user-profile #password-div').hide();
            $("#user-profile #editFirstName").prop("readonly", true);
            $("#user-profile #editLastName").prop("readonly", true);
            $("#user-profile #editAge").prop("readonly", true);
            $("#user-profile #editEmail").prop("readonly", true);
            $("#user-profile #editRoles").prop("disabled", true);
            let submit = $('#user-profile .modal-footer .submit-button');
            submit.text('Delete');
            submit.addClass('btn-danger');
            $('#user-profile #method').val("delete");

            $('#user-profile').modal("show");
        });

        $("#userprofile-form").on('submit', async function (e) {
            e.preventDefault();
            const method = $('#method').val();
            if (method === "put") {
                await fetchData('/api/admin', 'PUT', 'userprofile-form');
            } else if (method === "delete"){
                const id = $('#editId').val();
                await fetchData('/api/admin/'+id, 'DELETE');
            } else {
                console.log("wrong method");
            }

            $('#user-profile').modal("hide");
        });

        $("#new-user-form").on('submit', async function (e) {
            e.preventDefault();
            await fetchData('/api/admin', 'POST', 'new-user-form');
            $('.nav-tabs a[href="#nav-users_table"]').tab('show');
            $('#new-user-form')[0].reset();
        });

    } else {
        $('#adminPage').remove();
    }

    function createNavbar(user) {
        let currentRoles = rolesDesc(user.roles);
        let navbar = $('#my-navbar');
        navbar.html('');
        let navbarText = $('<span>');
        navbarText.append('<b>' + user.email + '</b>');
        navbarText.append(' with roles: ' + currentRoles);
        navbar.append(navbarText);
    }

    function createRolesInput() {
        let userForm = $('.select-role').html('');
        roles.map(r => {
            let option = ('<option name="role" id="'+r.name+'" value="'+r.id+'">'
                +r.description+'</option>');

            userForm.append(option);
        })
    }

    async function fetchData(url, methodRequest, formId) {
        let user;
        if(formId != null) {
            user = convertFormToJSON(formId);
        }
        const requestOptions = {
            method: methodRequest,
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: user
        };
        const response = await fetch(url, requestOptions);
        const users = await response.json();
        createTableBody(users);
    }

    async function fillUser(id) {
        let url = '/api/admin/' + id;
        let response = await fetch(url);
        let user = await response.json();

        $('#editId').val(user.id);
        $('#editFirstName').val(user.firstName);
        $('#editLastName').val(user.lastName);
        $('#editAge').val(user.age);
        $('#editEmail').val(user.email);
        $('#editPassword').val(user.password);
        $("option:selected").removeAttr("selected");
        user.roles.forEach((role) => {
            $("#editRoles option[value='" + role.id + "']").attr("selected", "selected");
        });
    }

    function createTableBody(usersList) {
        let table = $('#my-table');
        table.find('tbody').html('');
        usersList.map(u => {
            let rolesText = rolesDesc(u.roles);
            let tr = $('<tr>');
            tr.append('<td>' + u.id + '</td>');
            tr.append('<td>' + u.firstName + '</td>');
            tr.append('<td>' + u.lastName + '</td>');
            tr.append('<td>' + u.age + '</td>');
            tr.append('<td>' + u.email + '</td>');
            tr.append('<td>' + rolesText + '</td>');
            tr.append('<td><button class="btn btn-sm btn-info edit-button" data-id="'+u.id+'">Edit</button></td>');
            tr.append('<td><button class="btn btn-sm btn-danger delete-button" data-id="'+u.id+'">Delete</button></td>');
            table.find('tbody').append(tr);
        })
    }

    function rolesDesc(roles) {
        let rolesText="";
        $.each(roles,function(key, data) {
            rolesText+=data.description + " ";
        });
        return rolesText;
    }

    function convertFormToJSON(formId) {
        let object = {};
        const formData = getFormData(formId);
        formData.forEach((value, key) => {
            if(!Reflect.has(object, key)){
                if (key.includes("roles")){
                    object[key] = getRoleById(value);
                } else {
                    object[key] = value;
                    return;
                }
            }
            if (!Array.isArray(object[key])) {
                object[key] = [object[key]];

            } else {
                object[key].push(getRoleById(value));
            }
        });
        return JSON.stringify(object);
    }

    function getFormData(id) {
        const form = document.getElementById(id);
        return new FormData(form);
    }

    function getRoleById(id){
        return roles.find(o => o.id === parseInt(id));
    }

    async function createTableUser() {
        let url = '/api/user';
        let response = await fetch(url);
        let user = await response.json();
        createNavbar(user);

        let table = $('#table-user');
        table.find('tbody').html('');

        let rolesText = rolesDesc(user.roles);
        let tr = $('<tr class="border-top bg-light table-secondary">');
        tr.append('<td>' + user.id + '</td>');
        tr.append('<td>' + user.firstName + '</td>');
        tr.append('<td>' + user.lastName + '</td>');
        tr.append('<td>' + user.age + '</td>');
        tr.append('<td>' + user.email + '</td>');
        tr.append('<td>' + rolesText + '</td>');

        table.find('tbody').append(tr);

    }


})






