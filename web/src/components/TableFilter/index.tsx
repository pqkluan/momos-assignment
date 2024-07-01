import { FC, useEffect, useMemo, useReducer } from "react";

import {
  DatabaseProperties,
  DatabaseProperty,
  QueryRequestFilterParam,
} from "../../types/notion";
import { isSupportPropertyType } from "../../utils/isSupportPropertyType";
import { original, produce } from "immer";

type Props = {
  dbProperties: DatabaseProperties;
  filter?: QueryRequestFilterParam;
  setFilter: (filter: QueryRequestFilterParam) => void;
};

type FilterValue = boolean | string | number;
type DbPropertyType = DatabaseProperty["type"];

type State = {
  property?: DbPropertyType;
  method?: string;
  value?: FilterValue;
  meta?: DatabaseProperty;
};

const getDefaultMethod = (params: { propertyType: DbPropertyType }) => {
  const { propertyType } = params;

  switch (propertyType) {
    case "checkbox":
      return "equals";
    case "select":
      return "equals";
    case "status":
      return "equals";
    case "multi_select":
      return "contains";
    default:
      return undefined;
  }
};

const getDefaultValue = (params: {
  methodType: string;
  meta: DatabaseProperty;
}) => {
  const { methodType, meta } = params;

  if (["equals", "does_not_equal"].includes(methodType)) {
    switch (meta.type) {
      case "checkbox":
        return true;
      case "select":
        return (meta as Extract<DatabaseProperty, { type: "select" }>).select
          .options[0].name;
      case "status": {
        return (meta as Extract<DatabaseProperty, { type: "status" }>).status
          .options[0].name;
      }
    }
  }

  if (["is_empty", "is_not_empty"].includes(methodType)) {
    return true;
  }

  if (["contains", "does_not_contain"].includes(methodType)) {
    switch (meta.type) {
      case "multi_select":
        return (meta as Extract<DatabaseProperty, { type: "multi_select" }>)
          .multi_select.options[0].name;
    }
  }

  return undefined;
};

const reducer = produce(
  (
    draft: State,
    action:
      | {
          type: "SET_PROPERTY";
          payload: DbPropertyType;
          meta: DatabaseProperty;
        }
      | {
          type: "SET_METHOD";
          payload: string;
          meta: { defaultValue?: FilterValue };
        }
      | { type: "SET_VALUE"; payload: FilterValue }
      | { type: "RESET" }
  ) => {
    switch (action.type) {
      // Honestly, I don't like how the reducer is implemented here.
      // Because the how complex and different each filter type is, it's hard to make a generic reducer for all of them.
      // Simple filters like checkbox and select are easy to implement.
      // But for more complex filters like date and timestamp, it's a headache.

      case "SET_PROPERTY": {
        const { payload, meta } = action;
        draft.meta = meta;
        draft.property = payload;

        // Automatically set the method property type based on the property type
        const method = getDefaultMethod({ propertyType: meta.type });
        draft.method = method;

        // Automatically set the value
        if (method)
          draft.value = getDefaultValue({
            meta,
            methodType: method,
          });

        break;
      }
      case "SET_METHOD": {
        const { payload } = action;
        draft.method = payload;

        const { meta } = original(draft) as State;

        if (!!payload && !!meta) {
          draft.value = getDefaultValue({
            meta,
            methodType: payload,
          });
        }

        break;
      }
      case "SET_VALUE": {
        const { payload } = action;
        draft.value = payload;
        break;
      }
      case "RESET": {
        draft.meta = undefined;
        draft.property = undefined;
        draft.method = undefined;
        draft.value = undefined;
        break;
      }
      default: {
        return draft;
      }
    }
  }
);

export const TableFilter: FC<Props> = (props) => {
  const { dbProperties, setFilter } = props;

  const fields = useMemo(
    () =>
      Object.entries(dbProperties)
        .filter(([_, { type }]) => isSupportPropertyType(type))
        .map(([name]) => name as DbPropertyType),
    [dbProperties]
  );

  const [state, dispatch] = useReducer(reducer, {});
  const { property, method, value } = state;

  const setProperty = (payload: DbPropertyType) => {
    dispatch({ type: "SET_PROPERTY", payload, meta: dbProperties[payload] });
  };

  const setMethod = (payload: string, defaultValue?: FilterValue) => {
    dispatch({ type: "SET_METHOD", payload, meta: { defaultValue } });
  };

  const setValue = (payload: FilterValue) => {
    dispatch({ type: "SET_VALUE", payload });
  };

  const reset = () => {
    dispatch({ type: "RESET" });
  };

  const selectedProperty = property ? dbProperties[property] : undefined;

  useEffect(() => {
    if (
      typeof property === "string" &&
      typeof method === "string" &&
      typeof value !== "undefined" &&
      selectedProperty !== undefined
    ) {
      setFilter({
        property,
        [selectedProperty.type]: { [method]: value },
      } as any); // Not ideal to cast to any, but I don't have to to strongly type the whole filter object for every property type
    } else {
      setFilter(undefined);
    }
  }, [property, method, value, selectedProperty, setFilter]);

  if (!fields.length) return <div />;

  return (
    <div style={{ marginBottom: 16 }}>
      {!property ? (
        <button onClick={() => setProperty(fields[0])}>{"Use filter"}</button>
      ) : (
        <div>
          {<button onClick={reset}>{"Remove filter"}</button>}

          <div>{"Filtering by: "}</div>
          <div
            style={{
              display: "grid",
              gridAutoFlow: "column",
              gridColumnGap: 10,
              // 						display: grid
              // grid-auto-flow: column
              // grid-column-gap: 10px
            }}
          >
            <select
              onChange={(e) => setProperty(e.target.value as DbPropertyType)}
            >
              {fields.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            {selectedProperty ? (
              <FilterComponent
                property={selectedProperty}
                method={method}
                value={value}
                setMethod={setMethod}
                setValue={setValue}
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

type FilterProps = {
  method?: string;
  value?: FilterValue;
  setMethod: (method: string) => void;
  setValue: (value: FilterValue) => void;
};

const FilterComponent: FC<FilterProps & { property: DatabaseProperty }> = (
  props
) => {
  const { property } = props;

  if (property.type === "checkbox") {
    return <CheckBoxFilter {...props} property={property} />;
  }

  if (property.type === "status") {
    return <StatusFilter {...props} property={property} />;
  }

  if (property.type === "select") {
    return <SelectFilter {...props} property={property} />;
  }

  if (property.type === "multi_select") {
    return <MultiSelectFilter {...props} property={property} />;
  }

  return (
    <span
      style={{
        fontSize: 13,
      }}
    >
      {"The filter for this field is not implemented :("}
    </span>
  );
};

const CheckBoxFilter: FC<
  FilterProps & {
    property: Extract<DatabaseProperty, { type: "checkbox" }>;
  }
> = (props) => {
  const { method, value, setMethod, setValue } = props;

  return (
    <>
      <select value={method} onChange={(e) => setMethod(e.target.value)}>
        {["equals", "does_not_equal"].map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>

      <input
        type="checkbox"
        checked={!!value}
        onChange={(e) => setValue(e.target.checked)}
      />
    </>
  );
};

const SelectFilter: FC<
  FilterProps & {
    property: Extract<DatabaseProperty, { type: "select" }>;
  }
> = (props) => {
  const { property, method, value, setMethod, setValue } = props;

  const options = property.select.options.map((option) => option.name);

  return (
    <>
      <select value={method} onChange={(e) => setMethod(e.target.value)}>
        {["equals", "does_not_equal", "is_empty", "is_not_empty"].map(
          (name) => (
            <option key={name} value={name}>
              {name}
            </option>
          )
        )}
      </select>

      {!!method && ["equals", "does_not_equal"].includes(method) && (
        <select
          value={value as string}
          onChange={(e) => setValue(e.target.value)}
        >
          {options.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      )}
    </>
  );
};

const StatusFilter: FC<
  FilterProps & {
    property: Extract<DatabaseProperty, { type: "status" }>;
  }
> = (props) => {
  const { property, method, value, setMethod, setValue } = props;

  const options = property.status.options.map((option) => option.name);

  return (
    <>
      <select value={method} onChange={(e) => setMethod(e.target.value)}>
        {["equals", "does_not_equal", "is_empty", "is_not_empty"].map(
          (name) => (
            <option key={name} value={name}>
              {name}
            </option>
          )
        )}
      </select>

      {!!method && ["equals", "does_not_equal"].includes(method) && (
        <select
          value={value as string}
          onChange={(e) => setValue(e.target.value)}
        >
          {options.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      )}
    </>
  );
};

const MultiSelectFilter: FC<
  FilterProps & {
    property: Extract<DatabaseProperty, { type: "multi_select" }>;
  }
> = (props) => {
  const { property, method, value, setMethod, setValue } = props;

  const options = property.multi_select.options.map((option) => option.name);

  // FIXME: should be able to select multiple options

  return (
    <>
      <select value={method} onChange={(e) => setMethod(e.target.value)}>
        {["contains", "does_not_contain", "is_empty", "is_not_empty"].map(
          (name) => (
            <option key={name} value={name}>
              {name}
            </option>
          )
        )}
      </select>

      {!!method && ["contains", "does_not_contain"].includes(method) && (
        <select
          value={value as string}
          onChange={(e) => setValue(e.target.value)}
        >
          {options.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      )}
    </>
  );
};

// Comment for reference, from notion API document

// const boolean = "boolean";
// const alwaysTrue = true;
// const dateString = "string";
// const searchString = "string";
// const optionString = "string";
// const emptyObject = {};
// const number = "number";

// const fieldToTypeMapping = {
//   date: {
//     after: dateString,
//     before: dateString,
//     equals: dateString,

//     is_empty: alwaysTrue,
//     is_not_empty: alwaysTrue,

//     on_or_after: dateString,
//     on_or_before: dateString,

//     next_month: emptyObject,
//     next_week: emptyObject,
//     next_year: emptyObject,

//     past_month: emptyObject,
//     past_week: emptyObject,
//     past_year: emptyObject,
//     this_week: emptyObject,
//   },
//   multi_select: {
//     contains: optionString,
//     does_not_contain: optionString,

//     is_empty: alwaysTrue,
//     is_not_empty: alwaysTrue,
//   },
//   number: {
//     does_not_equal: number,
//     equals: number,
//     greater_than: number,
//     greater_than_or_equal_to: number,
//     less_than: number,
//     less_than_or_equal_to: number,

//     is_empty: alwaysTrue,
//     is_not_empty: alwaysTrue,
//   },
//   rich_text: {
//     equals: searchString,
//     does_not_equal: searchString,

//     contains: searchString,
//     does_not_contain: searchString,

//     starts_with: searchString,
//     ends_with: searchString,

//     is_empty: alwaysTrue,
//     is_not_empty: alwaysTrue,
//   },

//   // This is headache!!!
//   // timestamp: "created_time or last_edited_time",
//   // created_time: this.date,
//   // last_edited_time: this.date,
// };
