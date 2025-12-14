<?xml version="1.0" encoding="UTF-8"?>
<mule xmlns:db="http://www.mulesoft.org/schema/mule/db"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:apikit="http://www.mulesoft.org/schema/mule/mule-apikit"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns:http="http://www.mulesoft.org/schema/mule/http"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
http://www.mulesoft.org/schema/mule/http http://www.mulesoft.org/schema/mule/http/current/mule-http.xsd
http://www.mulesoft.org/schema/mule/mule-apikit http://www.mulesoft.org/schema/mule/mule-apikit/current/mule-apikit.xsd
http://www.mulesoft.org/schema/mule/ee/core http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd
http://www.mulesoft.org/schema/mule/db http://www.mulesoft.org/schema/mule/db/current/mule-db.xsd">

    <!-- Listener -->
    <http:listener-config name="employee-api-httpListenerConfig">
        <http:listener-connection host="0.0.0.0" port="8081"/>
    </http:listener-config>

    <!-- APIKit -->
    <apikit:config name="employee-api-config"
                   api="resource::9d1ade30-ec6e-4c77-9c3a-b52d71203a73:new-employee-api:1.0.0:raml:zip:employee-api.raml"
                   outboundHeadersMapName="outboundHeaders"
                   httpStatusVarName="httpStatus"/>

    <!-- DB -->
    <db:config name="Database_Config">
        <db:my-sql-connection
                host="${db.host}"
                port="${db.port}"
                user="${db.user}"
                password="${db.password}"
                database="${db.database}"/>
    </db:config>

    <configuration-properties file="config.yaml"/>

    <!-- MAIN -->
    <flow name="employee-api-main">
        <http:listener config-ref="employee-api-httpListenerConfig" path="/api/*"/>
        <apikit:router config-ref="employee-api-config"/>
    </flow>

    <!-- ================= CRUD FLOWS ================= -->

    <!-- GET /employees -->
    <flow name="get:\employees:employee-api-config">
        <db:select config-ref="Database_Config">
            <db:sql><![CDATA[
SELECT * FROM employees;
]]></db:sql>
        </db:select>

        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
payload]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </flow>

    <!-- GET /employees/{id} -->
    <flow name="get:\employees\(id):employee-api-config">
        <db:select config-ref="Database_Config">
            <db:sql><![CDATA[
SELECT * FROM employees WHERE id = :id;
]]></db:sql>
            <db:input-parameters><![CDATA[
{
  id: attributes.uriParams.id as Number
}]]></db:input-parameters>
        </db:select>

        <choice>
            <when expression="#[isEmpty(payload)]">
                <raise-error type="APIKIT:NOT_FOUND"/>
            </when>
        </choice>

        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
payload[0]]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </flow>

    <!-- POST /employees -->
    <flow name="post:\employees:application\json:employee-api-config">
        <db:insert config-ref="Database_Config">
            <db:sql><![CDATA[
INSERT INTO employees (name, email, department, salary)
VALUES (:name, :email, :department, :salary);
]]></db:sql>
            <db:input-parameters><![CDATA[
{
  name: payload.name,
  email: payload.email,
  department: payload.department,
  salary: payload.salary
}]]></db:input-parameters>
        </db:insert>

        <set-variable variableName="httpStatus" value="201"/>

        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
payload]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </flow>

    <!-- PUT /employees/{id} -->
    <flow name="put:\employees\(id):application\json:employee-api-config">
        <db:update config-ref="Database_Config">
            <db:sql><![CDATA[
UPDATE employees
SET name = :name,
    email = :email,
    department = :department,
    salary = :salary
WHERE id = :id;
]]></db:sql>
            <db:input-parameters><![CDATA[
{
  id: attributes.uriParams.id as Number,
  name: payload.name,
  email: payload.email,
  department: payload.department,
  salary: payload.salary
}]]></db:input-parameters>
        </db:update>

        <choice>
            <when expression="#[payload.affectedRows == 0]">
                <raise-error type="APIKIT:NOT_FOUND"/>
            </when>
        </choice>

        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  message: "Employee updated successfully"
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </flow>

    <!-- DELETE /employees/{id} -->
    <flow name="delete:\employees\(id):employee-api-config">
        <db:delete config-ref="Database_Config">
            <db:sql><![CDATA[
DELETE FROM employees WHERE id = :id;
]]></db:sql>
            <db:input-parameters><![CDATA[
{
  id: attributes.uriParams.id as Number
}]]></db:input-parameters>
        </db:delete>

        <choice>
            <when expression="#[payload.affectedRows == 0]">
                <raise-error type="APIKIT:NOT_FOUND"/>
            </when>
        </choice>

        <set-variable variableName="httpStatus" value="204"/>
        <set-payload value=""/>
    </flow>

</mule>
