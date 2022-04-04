package httpext

import (
	"errors"
	"net/http"
	"reflect"

	"github.com/gorilla/schema"
	"github.com/teawithsand/twsblog/util/cext"
)

type SimpleHandlerFactory struct {
	Loader    Loader
	Responder Responder

	Middleware       Middleware
	Arguments        []reflect.Value
	ArgumentsFactory func(r *http.Request) []reflect.Value
}

func (shf *SimpleHandlerFactory) MakeHandlerWithBody(rfn interface{}) (h http.Handler, err error) {
	var fn reflect.Value
	switch tfn := rfn.(type) {
	case reflect.Value:
		fn = tfn
	default:
		fn = reflect.ValueOf(tfn)
	}

	if fn.Kind() != reflect.Func {
		err = errors.New("util/httpext: value is not a function")
		return
	}

	ty := fn.Type()
	if shf.ArgumentsFactory == nil {
		if ty.NumIn() != len(shf.Arguments)+1 {
			err = errors.New("util/httpext: argument count mistmatch")
			return
		}
	}

	if ty.NumOut() != 2 {
		err = errors.New("util/httpext: return count mistmatch")
		return
	}

	if !ty.Out(1).AssignableTo(reflect.TypeOf((*error)(nil)).Elem()) {
		err = errors.New("util/httpext: 2nd return argument is not error")
		return
	}

	argTy := ty.In(ty.NumIn() - 1)

	h = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// handle any error comming from outer scope
		// preferrably move this code somewhere else in future
		err := cext.Error(r.Context())
		if err != nil {
			shf.Responder.RespondWithData(r.Context(), w, err)
			return
		}

		data := reflect.New(argTy)

		err = shf.Loader.LoadData(r.Context(), r.Body, data.Interface())
		if err != nil {
			shf.Responder.RespondWithData(r.Context(), w, err)
			return
		}

		var args []reflect.Value
		if shf.ArgumentsFactory == nil {
			args = make([]reflect.Value, 0, len(shf.Arguments)+1)
			args = append(args, shf.Arguments...)
		} else {
			args = shf.ArgumentsFactory(r)
		}
		args = append(args, data.Elem())

		fnReturn := fn.Call(args)
		res, reflectErr := fnReturn[0], fnReturn[1]

		if !reflectErr.IsNil() {
			ctx := cext.PutError(r.Context(), reflectErr.Interface().(error))

			shf.Responder.RespondWithData(ctx, w, reflectErr.Interface())
			return
		}

		shf.Responder.RespondWithData(r.Context(), w, res.Interface())
	})

	if shf.Middleware != nil {
		h = shf.Middleware.Apply(h)
	}

	return
}

var queryDecoder = schema.NewDecoder()

func (shf *SimpleHandlerFactory) MakeHandlerWithQuery(rfn interface{}) (h http.Handler, err error) {
	var fn reflect.Value
	switch tfn := rfn.(type) {
	case reflect.Value:
		fn = tfn
	default:
		fn = reflect.ValueOf(tfn)
	}

	if fn.Kind() != reflect.Func {
		err = errors.New("util/httpext: value is not a function")
		return
	}

	ty := fn.Type()
	if shf.ArgumentsFactory == nil {
		if ty.NumIn() != len(shf.Arguments)+1 {
			err = errors.New("util/httpext: argument count mistmatch")
			return
		}
	}

	if ty.NumOut() != 2 {
		err = errors.New("util/httpext: return count mistmatch")
		return
	}

	if !ty.Out(1).AssignableTo(reflect.TypeOf((*error)(nil)).Elem()) {
		err = errors.New("util/httpext: 2nd return argument is not error")
		return
	}

	argTy := ty.In(ty.NumIn() - 1)

	h = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// handle any error comming from outer scope
		// preferrably move this code somewhere else in future
		err := cext.Error(r.Context())
		if err != nil {
			shf.Responder.RespondWithData(r.Context(), w, err)
			return
		}

		data := reflect.New(argTy)

		err = queryDecoder.Decode(data.Interface(), r.URL.Query())
		if err != nil {
			return
		}

		var args []reflect.Value
		if shf.ArgumentsFactory == nil {
			args = make([]reflect.Value, 0, len(shf.Arguments)+1)
			args = append(args, shf.Arguments...)
		} else {
			args = shf.ArgumentsFactory(r)
		}
		args = append(args, data.Elem())

		fnReturn := fn.Call(args)
		res, reflectErr := fnReturn[0], fnReturn[1]

		if !reflectErr.IsNil() {
			ctx := cext.PutError(r.Context(), reflectErr.Interface().(error))

			shf.Responder.RespondWithData(ctx, w, reflectErr.Interface())
			return
		}

		shf.Responder.RespondWithData(r.Context(), w, res.Interface())
	})

	if shf.Middleware != nil {
		h = shf.Middleware.Apply(h)
	}

	return
}

func (shf *SimpleHandlerFactory) MustMakeHandlerWithBody(fn interface{}) (h http.Handler) {
	h, err := shf.MakeHandlerWithBody(fn)
	if err != nil {
		panic(err)
	}
	return
}

func (shf *SimpleHandlerFactory) MustMakeHandlerWithQuery(fn interface{}) (h http.Handler) {
	h, err := shf.MakeHandlerWithQuery(fn)
	if err != nil {
		panic(err)
	}
	return
}
