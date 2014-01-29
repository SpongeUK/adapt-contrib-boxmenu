define(function(require) {

    var Backbone = require('backbone');
    var Adapt = require('coreJS/adapt');
    var MenuView = require('coreViews/menuView');
    
    var BoxMenuView = MenuView.extend({
        
        postRender: function() {
            var nthChild = 0,
                locked = false;

            this.model.getChildren().each(function(item) {
                if(item.get('_isAvailable')) {
                    nthChild ++;
                    item.set('_isLocked', locked);
                    var menuItem = new BoxMenuItemView({model:item, nthChild:nthChild});
                    this.$('.menu-container-inner').append(menuItem.$el);
                    locked = !menuItem.isComplete() || locked;
                }
            });
        }

    }, {
        template:'boxmenu'
    });

    var BoxMenuItemView = MenuView.extend({

        className: function() {
            return [
                'menu-item',
                'menu-item-' + this.model.get('_id') ,
                'nth-child-' + this.options.nthChild,
                this.options.nthChild % 2 === 0  ? 'nth-child-even' : 'nth-child-odd',
                this.model.get('_isLocked') ? 'locked' : 'unlocked',
                this.isComplete() ? 'complete' : 'incomplete'
            ].join(' ');
        },

        preRender: function() {

        },

        postRender: function() {
            this.$el.imageready(_.bind(function() {
                this.setReadyStatus();
            }, this));
        },

        isComplete: function() {
            console.log('Checking', this.model.get('_id'));
            return this.model.findDescendants('components').every(function (item) {
                return item.get('_isComplete');
            });
        }

    }, {
        template:'boxmenu-item'
    });
    
    Adapt.on('router:menu', function(model) {
        $('#wrapper').append(new BoxMenuView({model:model}).$el);
    });
    
});
