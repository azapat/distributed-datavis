const Properties = require("../../src/properties/Properties")

const rules = {
    age: {type:'number'},
    color: {type:'string'},
    happy: {type:'boolean'},
}

const props = new Properties(rules)

props.setProperties({
    age: 10,
    happy: true,
});

props.setProperties({
    age: 15,
    happy: 'invalid',
    color: 0,
});

test('Override Property',()=>expect(props.age).toBe(15));
test("Don't override if value is incorrect",()=>expect(props.happy).toBe(true));
test("Don't set if value is incorrect",()=>expect(props.color).toBe(undefined));